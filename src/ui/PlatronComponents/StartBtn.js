import classNames from "classnames";
import React from "react";

function StartBtn(props) {
  const name = props.name;
  const text = props.text;
  const script = props.script;
  const gsa = props.selectedADBDevices;
  const gsf = props.selectedFBDevices;

  function handleClick(e) {
    console.log(...script);
    console.log(gsa, gsf);
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
