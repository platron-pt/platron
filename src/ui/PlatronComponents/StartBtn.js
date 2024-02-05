import classNames from "classnames";
import React from "react";

function StartBtn(props) {
  const name = props.name;
  const text = props.text;
  const script = props.script;
  const gsa = props.selectedADBDevices;
  const gsf = props.selectedFBDevices;
  const status = props.status;
  const keyPath = props.keyPath;
  const platformInfo=props.platformInfo

  function runPlatformToolsCommand(params, index) {

    console.log(platformInfo)

    params.push(script[index].verb);
    params.push(
      ...script[index].params.map((element) => {
        switch (element) {
          case "$file":
            return status[keyPath].filePath;
            break;
          case "$radio":
            if (status[keyPath].radio == "other") {
              status[keyPath].textInput;
            } else {
              return status[keyPath].radio;
            }
            break;
          default:
            return element;
            break;
        }
      })
    );

    let fileExtension = "";
    let execDir = "";
    let execFile = "";
    if (platformInfo.os.platform == "win32") {
      execDir = ".\\platform-tools-win\\";
      fileExtension = ".exe";
    }
    if (platformInfo.os.platform == "linux") {
      execDir = "./platform-tools-linux/";
    }
    execFile = execDir + script[index].mode + fileExtension;

    console.log(execFile, params);
  }

  function runIfDeviceIsStillOnline(foundDevices, msgToCheck, scriptIndex) {
    foundDevices.some((element, index) => {
      if (msgToCheck.indexOf(element) >= 0) {
        const params = [];
        params.push("-s");
        params.push(foundDevices[index]);

        runPlatformToolsCommand(params, scriptIndex);
      }
    });
  }

  function handleClick(e) {
    console.log(...script);
    console.log(gsa, gsf);

    script.forEach((element, index) => {
      if (element.mode == "adb") {
        if (gsa.size) {
          api.invoke("get-devices", "adb").then((res) => {
            runIfDeviceIsStillOnline(Array.from(gsa), res.stdout, index);
          });
        } else {
          runPlatformToolsCommand([]);
        }
      }

      if (element.mode == "fastboot") {
        if (gsf.size) {
          api.invoke("get-devices", "fb").then((res) => {
            runIfDeviceIsStillOnline(Array.from(gsf), res.stdout, index);
          });
        } else {
          runPlatformToolsCommand([], index);
        }
      }
    });
  }

  return (
    <button
      type="button"
      className={classNames(
        "btn",
        "btn-primary",
        "startAction-btn",
        "border-0"
      )}
      id={name + "-btn"}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default StartBtn;
