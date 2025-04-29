import React from "react";
import classNames from "classnames";
const merge = require("deepmerge");
import icons from "../../../res/icons/icons";

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
    // console.log(props);
    api.invoke("open-file-dialog", misc).then((result) => {
      if(!result.canceled) {
        handleChange(result.filePaths[0]);
      }
    });
  }

  return (
    // <div className="mb-3">
    //   <label
    //     className={classNames("btn", "btn-primary")}
    //     htmlFor={keyPath + "-file-input"}
    //   >
    //     <icons.Files></icons.Files>
    //     {text}
    //   </label>
    //   <input
    //     className={classNames("d-none", "file-input", keyPath)}
    //     onChangeCapture={handleChange}
    //     type="file"
    //     name={name}
    //     id={keyPath + "-file-input"}
    //     accept={misc}
    //   />
    //   <h5
    //     id={keyPath + "-file-path"}
    //     className={classNames("user-select-none", keyPath)}
    //   >
    //     {status.has(keyPath)
    //       ? !!status.get(keyPath).filePath
    //         ? status.get(keyPath).filePath
    //         : defaultText
    //       : defaultText}
    //   </h5>
    // </div>
    <div className="mb-3">
      <button
        className={classNames("btn", "btn-primary")}
        onClick={handleClick}
      >
        <span className="me-2">
          <icons.Files></icons.Files>
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

// keyPath in status ? status[keyPath].filePath : defaultText
