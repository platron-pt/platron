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

  function handleChange(filePath) {
    const currentStatus = new Map(status);
    // const currentStatus = merge(status, {
    //   [keyPath]: { filePath: e.target.files[0].path },
    // });
    const thisStatus = currentStatus.get(keyPath);
    currentStatus.set(
      keyPath,
      merge(thisStatus, { filePath: filePath })
    );
    setStatus(currentStatus);
  }

  async function handleClick(e) {
    api.invoke("open-file-dialog", misc).then((result) => {
      if(!result.canceled) {
        handleChange(result.filePaths[0]);
      }
    });
  }

  return (
    <div className="mb-3">
      <button
        className={classNames("btn", "btn-primary")}
        onClick={handleClick}
      >
        <span className="me-2">
          <i className="bi bi-files"></i>
        </span>
        {text}
      </button>
      <h5
        id={keyPath + "-file-path"}
        className={classNames("user-select-none", keyPath)}
      >
        {status.has(keyPath)
          ? !!status.get(keyPath).filePath
            ? status.get(keyPath).filePath
            : defaultText
          : defaultText}
      </h5>
    </div>
  );
}

export default File;