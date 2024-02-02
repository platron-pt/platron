import classNames from "classnames";
import React from "react";

function StartBtn(props) {
  const name = props.name;
  const text = props.text;
  const script = props.script;
  const gsa = props.selectedADBDevices;
  const gsf = props.selectedFBDevices;

  function runIfDeviceIsStillOnline(foundDevices, msgToCheck) {
    foundDevices.some((element, index) => {
      if (msgToCheck.indexOf(element) >= 0) {
        console.log(foundDevices[index]);
      }
    });
  }

  function handleClick(e) {
    console.log(...script);
    console.log(gsa, gsf);

    script.map((element) => {
      console.log(element);
      if (element.mode == "adb") {
        api.invoke("get-devices", "adb").then((res) => {
          runIfDeviceIsStillOnline(Array.from(gsa), res.stdout);
        });
      }
      if (element.mode == "fastbooot") {
        api.invoke("get-devices", "fb").then((res) => {
          runIfDeviceIsStillOnline(Array.from(gsf), res.stdout);
        });
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
