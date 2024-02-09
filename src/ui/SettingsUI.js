import classNames from "classnames";
import React, { useState } from "react";
import { availableLanguages } from "./UI";
const merge = require("deepmerge");

const config = require("../../config.json");
let appLanguage = config.language;
if (config.language === "auto") {
  switch (navigator.language) {
    case "zh-TW":
    case "en-US":
      appLanguage = navigator.language;
      break;
    default:
      appLanguage = "en-US";
  }
}

const messages = require("../../res/json/lang/" +
  appLanguage +
  "/messages.json");

function DropDownBtn(props) {
  const options = props.options;
  const currentOption = props.currentOption;
  const setCurrentOption = props.setCurrentOption;
  const optionsShowText = props.optionsShowText;
  const configKey = props.configKey;

  function handleClick(e) {
    console.log(currentOption);
    setCurrentOption(
      merge(currentOption, { [configKey]: e.target.getAttribute("value") })
    );
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {optionsShowText[currentOption[configKey]]}
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

function AboutCard(props) {
  const platformInfo = props.platformInfo;

  function getChromeVersion() {
    const ua = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return ua ? parseInt(ua[2], 10) : false;
  }
  return (
    <div className={classNames("card", "mb-2")}>
      <div className="card-body">
        <h6>
          {messages.info.appVersion}
          {platformInfo.appVersion}
        </h6>
        <h6>
          {messages.info.chromeVersion}
          {getChromeVersion()}
        </h6>
        <h6>
          {messages.info.osType}
          {platformInfo.os.type}
        </h6>
        <h6>
          {messages.info.osRelease}
          {platformInfo.os.release}
        </h6>
      </div>
    </div>
  );
}

function SettingsUI(props) {
  const config = props.config;
  const setConfig = props.setConfig;

  const [currentConfig, setCurrentConfig] = useState(merge({}, config));

  function handleClick() {
    setConfig(currentConfig);
    alert(messages.alert.restartAlert);
  }
  return (
    <>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center">{messages.settings.language}</span>

        <DropDownBtn
          options={[...availableLanguages, "auto"]}
          currentOption={currentConfig}
          setCurrentOption={setCurrentConfig}
          configKey="language"
          optionsShowText={messages.settingsValues.language}
        />
      </div>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center">{messages.settings.theme}</span>

        <DropDownBtn
          options={["dark", "light", "auto"]}
          currentOption={currentConfig}
          setCurrentOption={setCurrentConfig}
          configKey="theme"
          optionsShowText={messages.settingsValues.theme}
        />
      </div>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center">
          {messages.settings.updateFrequency}
        </span>

        <DropDownBtn
          options={["1", "2", "3", "7", "14"]}
          currentOption={currentConfig}
          setCurrentOption={setCurrentConfig}
          configKey="updateFrequency"
          optionsShowText={messages.settingsValues.updateFrequency}
        />
      </div>
      <AboutCard platformInfo={props.platformInfo} />
      <div className={classNames("d-flex", "justify-content-end")}>
        <button onClick={handleClick} className={classNames("btn", "btn-info")}>
          {messages.settings.save}
        </button>
      </div>
    </>
  );
}

export default SettingsUI;
