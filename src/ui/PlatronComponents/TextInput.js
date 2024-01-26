import React, { useEffect } from "react";
import classNames from "classnames";

function TextInput(props) {
  const keyPath = props.keyPath;
  const value = props.value;
  const misc = props.misc;
  const status = props.status;
  const setStatus = props.setStatus;

  function handleChange(e) {
    const currentStatus = Object.assign(status, {});
    console.log("keyPath in currentStatus:", keyPath in currentStatus);
    if (!(keyPath in currentStatus)) {
      Object.assign(currentStatus, { [keyPath]: { textInput: null } });
    }
    console.log(e, currentStatus);
    currentStatus[keyPath].textInput = e.target.value;
    setStatus(currentStatus);
  }

  return (
    <input
      id={keyPath + "-" + value}
      className={classNames("extra-input", "mb-3", "d-block", keyPath)}
      type="text"
      placeholder={misc}
      onChange={handleChange}
      defaultValue={status[keyPath] ? status[keyPath].textInput : ""}
    />
  );
}

export default TextInput;
