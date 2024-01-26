import classNames from "classnames";
import React from "react";

function StartBtn(props) {
  const name = props.name;
  const text = props.text;

  function handleClick(e) {
    console.log(e);
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
