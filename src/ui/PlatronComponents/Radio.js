import React from "react";
import classNames from "classnames";
const merge=require("deepmerge")

function Radio(props) {
  const name = props.name;
  const value = props.value;
  const keyPath = props.keyPath;
  const text = props.text;
  const misc = props.misc;
  const status = props.status;
  const inputRef=props.inputRef
  const setStatus = props.setStatus;

  function handleChange(e) {
    e.stopPropagation();
    const currentStatus = merge(status, {
      [keyPath]: { radio: e.target.value },
    });
    setStatus(currentStatus);
    
    if(e.target.value=="other"){
      inputRef.current.focus();
    }
  }

  return (
    <div className="form-check">
      <input
        className={classNames(`form-check-input`, keyPath)}
        type="radio"
        name={name}
        id={keyPath + "-" + value}
        defaultValue={value}
        checked={
          keyPath in status ? value == status[keyPath].radio : misc
        }
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor={keyPath + "-" + value}>
        {text}
      </label>
    </div>
  );
}

export default Radio;
