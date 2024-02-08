import classNames from "classnames";
import { param } from "jquery";
import React from "react";

function StartBtn(props) {
  const name = props.name;
  const text = props.text;
  const script = props.script;
  const selectedDevices = props.selectedDevices;
  const status = props.status;
  const keyPath = props.keyPath;
  const platformInfo = props.platformInfo;

  function runPlatformToolsCommand(params, index) {
    params.push(script[index].verb);
    params.push(
      ...script[index].params.map((element) => {
        switch (element) {
          case "$file":
            return status.get(keyPath).filePath;
            break;
          case "$radio":
            if (status.get(keyPath).radio == "other") {
              return status.get(keyPath).textInput;
            } else {
              return status.get(keyPath).radio;
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

    api.runCommand(execFile, params);
  }

  function runIfDeviceIsStillOnline(foundDevices, msgToCheck, scriptIndex) {
    foundDevices.some((element, index) => {
      let selectedDeviceFound = 0;
      if (msgToCheck.indexOf(element) >= 0) {
        const params = [];
        params.push("-s");
        params.push(foundDevices[index]);
        selectedDeviceFound = 1;
        runPlatformToolsCommand(params, scriptIndex);
      }
      if (!selectedDeviceFound) {
        runPlatformToolsCommand([], scriptIndex);
      }
    });
  }

  function handleClick() {
    script.forEach((element, index) => {
      if (element.mode == "adb") {
        if (selectedDevices.size) {
          api.invoke("get-devices", "adb").then((res) => {
            runIfDeviceIsStillOnline(Array.from(selectedDevices), res.stdout, index);
          });
        } else {
          runPlatformToolsCommand([],index);
        }
      }

      if (element.mode == "fastboot") {
        if (selectedDevices.size) {
          api.invoke("get-devices", "fb").then((res) => {
            runIfDeviceIsStillOnline(Array.from(selectedDevices), res.stdout, index);
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
