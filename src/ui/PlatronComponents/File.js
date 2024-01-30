import React from "react";
import classNames from "classnames";
const merge = require("deepmerge");

function File(props) {
  const keyPath = props.keyPath;
  const text = props.text;
  const name = props.name;
  const misc = props.misc;
  const status = props.status;
  const setStatus = props.setStatus;
  const defaultText = props.defaultText;

  function handleChange(e) {
    const currentStatus = merge(status, {
      [keyPath]: { filePath: e.target.files[0].path },
    });
    setStatus(currentStatus);
  }

  return (
    <div className="mb-3">
      <label
        className={classNames("btn", "btn-primary")}
        htmlFor={keyPath + "-file-input"}
      >
        <i className={classNames("bi", "bi-files")}></i>
        {text}
      </label>
      <input
        className={classNames("d-none", "file-input", keyPath)}
        onChangeCapture={handleChange}
        type="file"
        name={name}
        id={keyPath + "-file-input"}
        accept={misc}
      />
      <h5
        id={keyPath + "-file-path"}
        className={classNames("user-select-none", keyPath)}
      >
        {keyPath in status
          ? !!status[keyPath].filePath
            ? status[keyPath].filePath
            : defaultText
          : defaultText}
      </h5>
    </div>
  );
}

export default File;

// keyPath in status ? status[keyPath].filePath : defaultText
