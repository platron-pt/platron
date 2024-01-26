import React from "react";
import classNames from "classnames";

function Radio(props) {
  const name = props.name;
  const value = props.value;
  const keyPath = props.keyPath;
  const text = props.text;
  const misc = props.misc;
  const status = props.status;
  const setStatus = props.setStatus;

  function handleChange(e) {
    const currentStatus = Object.assign(status, {});
    console.log("keyPath in currentStatus:", keyPath in currentStatus);
    if (!(keyPath in currentStatus)) {
      Object.assign(currentStatus, { [keyPath]: { radio: null } });
    }
    console.log(e, currentStatus);
    currentStatus[keyPath].radio = e.target.value;
    setStatus(currentStatus);
  }

  return (
    <div className="form-check">
      <input
        className={classNames(`form-check-input`, keyPath)}
        type="radio"
        name={name}
        id={keyPath + "-" + value}
        defaultValue={value}
        defaultChecked={status[keyPath] ? value == status[keyPath].radio : misc}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor={keyPath + "-" + value}>
        {text}
      </label>
    </div>
  );
}

export default Radio;
