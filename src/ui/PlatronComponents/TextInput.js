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
    const currentStatus = new Map(status);
    // const currentStatus = merge(status, {
    //   [keyPath]: { textInput: e.target.value },
    // });
    const thisStatus = currentStatus.get(keyPath);
    currentStatus.set(
      keyPath,
      merge(thisStatus, { textInput: e.target.value })
    );
    setStatus(currentStatus);
  }

  function handleFocus(e) {
    const currentStatus = new Map(status);
    // const currentStatus = merge(status, {
    //   [keyPath]: { radio: "other" },
    // });
    const thisStatus = currentStatus.get(keyPath);
    currentStatus.set(keyPath, merge(thisStatus, { radio: "other" }));
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
      value={
        status.has(keyPath)
          ? !!status.get(keyPath).textInput
            ? status.get(keyPath).textInput
            : ""
          : ""
      }
    />
  );
});

export default TextInput;
