import React from "react";
import classNames from "classnames";

function File(props) {
  const [filePath, setFilePath] = React.useState("");
  const keyPath = props.keyPath;
  const text = props.text;
  const name = props.name;
  const misc = props.misc;
  const defaultText = props.defaultText;
  function handleChange(e) {
    setFilePath(e.target.files[0].path);
  }
  return (
    <div className="mb-3">
      <label
        className={classNames("btn", "btn-primary")}
        htmlFor={keyPath + "-file-input"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="currentColor"
          className={classNames("bi", "bi-files")}
          viewBox="0 0 16 16"
        >
          <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
        </svg>
        {text}
      </label>
      <input
        className={classNames("d-none", "file-input", keyPath)}
        onChange={handleChange}
        type="file"
        name={name}
        id={keyPath + "-file-input"}
        accept={misc}
      />
      <h5
        id={keyPath + "-file-path"}
        className={classNames("user-select-none", keyPath)}
      >
        {filePath ? filePath : defaultText}
      </h5>
    </div>
  );
}

export default File;