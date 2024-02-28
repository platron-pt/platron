import React, { useEffect } from "react";
import classNames from "classnames";
const merge = require("deepmerge");

function Radio(props) {
  const name = props.name;
  const value = props.value;
  const keyPath = props.keyPath;
  const text = props.text;
  const misc = props.misc;
  const status = props.status;
  const inputRef = props.inputRef;
  const setStatus = props.setStatus;

  if (status.has(keyPath)) {
    console.log(value == status.get(keyPath).radio);
  }
  useEffect(() => {
    if (misc == "checked" && !status.has(keyPath)) {
      const currentStatus = new Map(status);
      // const currentStatus = merge(status, {
      //   [keyPath]: { radio: value },
      // });
      const thisStatus = currentStatus.get(keyPath);
      currentStatus.set(keyPath, merge(thisStatus, { radio: value }));
      setStatus(currentStatus);
    }
  }, []);

  function handleChange(e) {
    e.stopPropagation();
    const currentStatus = new Map(status);
    const thisStatus = currentStatus.get(keyPath);

    currentStatus.set(keyPath, merge(thisStatus, { radio: e.target.value }));
    // const currentStatus = merge(status, {
    //   [keyPath]: { radio: e.target.value },
    // });

    setStatus(currentStatus);

    if (e.target.value == "other") {
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
          status.has(keyPath)
            ? value == status.get(keyPath).radio
            : !!misc
            ? misc
            : ""
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
