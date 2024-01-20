import React from "react";
import classNames from "classnames";

function Radio(props) {
  const name = props.name;
  const value = props.value;
  const keyPath = props.keyPath;
  const text = props.text;
  const misc = props.misc;
  return (
    <div className="form-check">
      <input
        className={classNames(`form-check-input`, keyPath)}
        type="radio"
        name={name}
        id={keyPath + "-" + value}
        defaultValue={value}
        defaultChecked={misc}
      />
      <label className="form-check-label" htmlFor={keyPath + "-" + value}>
        {text}
      </label>
    </div>
  );
}

export default Radio;
