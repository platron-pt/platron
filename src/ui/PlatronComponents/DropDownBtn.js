import React from "react";
import cn from "classnames";
import { Dropdown } from "react-bootstrap";
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
    <Dropdown>
      <Dropdown.Toggle variant="secondary" size="sm">
        {optionsShowText[config[configKey]]}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((value) => {
          return (
            <Dropdown.Item
              as="button"
              onClick={handleClick}
              key={value}
              value={value}
            >
              {optionsShowText[value]}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
