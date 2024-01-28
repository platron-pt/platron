import React from "react";
import classNames from "classnames";
const merge = require("deepmerge");

const TextInput = React.forwardRef(function TextInput(props, ref) {
  const keyPath = props.keyPath;
  const value = props.value;
  const misc = props.misc;
  const status = props.status;
  const setStatus = props.setStatus;

  function handleChange(e) {
    const currentStatus = merge(status, {
      [keyPath]: { textInput: e.target.value },
    });
    console.log(status);
    currentStatus[keyPath].textInput = e.target.value;
    setStatus(currentStatus);
  }

  function handleFocus(e) {
    e.stopPropagation();
    const currentStatus = merge(status, {
      [keyPath]: { radio: "other" },
    });

    setStatus(currentStatus);
  }

  return (
    <input
      id={keyPath + "-" + value}
      className={classNames("extra-input", "mb-3", "d-block", keyPath)}
      type="text"
      placeholder={misc}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={ref}
      defaultValue={keyPath in status ? status[keyPath].textInput : ""}
    />
  );
});

export default TextInput;
