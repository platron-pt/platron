import React from "react";
import classNames from "classnames";

function TextInput(props) {
  const keyPath=props.keyPath
  const value=props.value
  const misc=props.misc

  return (
    <input
      id={keyPath + "-" + value}
      className={classNames("extra-input", "mb-3", keyPath)}
      type="text"
      placeholder={misc}
    />
  );
}

export default TextInput;
