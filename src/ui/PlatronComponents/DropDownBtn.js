import React from "react";
import cn from "classnames";
const merge = require("deepmerge");

export function DropDownBtn(props) {
  const options = props.options;
  const config = props.config;
  const setConfig = props.setConfig;
  const optionsShowText = props.optionsShowText;
  const configKey = props.configKey;

  function handleClick(e) {
    setConfig(merge(config, { [configKey]: e.target.getAttribute("value") }));
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary btn-sm dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {optionsShowText[config[configKey]]}
      </button>
      <ul className="dropdown-menu">
        {options.map((value) => {
          return (
            <li onClick={handleClick} key={value}>
              <a className="dropdown-item" href="#" value={value}>
                {optionsShowText[value]}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
