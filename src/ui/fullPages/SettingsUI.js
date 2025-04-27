import classNames from "classnames";
import React, { useState } from "react";
import { availableLanguages } from "../UI";
const merge = require("deepmerge");

function DropDownBtn(props) {
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

function AboutCard(props) {
  const platformInfo = props.platformInfo;
  const messages = props.messages;

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
          {messages.info.osVersion}
          {platformInfo.os.release}
        </h6>
      </div>
    </div>
  );
}

function SettingsUI(props) {
  const config = props.config;
  const setConfig = props.setConfig;
  const messages = props.messages;

  function handleClick() {
    api.writeFile("config.json", JSON.stringify(config, null, "  "));
  }
  return (
    <>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center me-2">{messages.settings.language}</span>

        <DropDownBtn
          options={[...availableLanguages, "auto"]}
          config={config}
          setConfig={setConfig}
          configKey="language"
          optionsShowText={messages.settingsValues.language}
        />
      </div>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center me-2">{messages.settings.theme}</span>

        <DropDownBtn
          options={["dark", "light", "auto"]}
          config={config}
          setConfig={setConfig}
          configKey="theme"
          optionsShowText={messages.settingsValues.theme}
        />
      </div>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center me-2">
          {messages.settings.updateFrequency}
        </span>

        <DropDownBtn
          options={["1", "2", "3", "7", "14"]}
          config={config}
          setConfig={setConfig}
          configKey="updateFrequency"
          optionsShowText={messages.settingsValues.updateFrequency}
        />
      </div>
      <AboutCard platformInfo={props.platformInfo} messages={messages} />
      <div className={classNames("d-flex", "justify-content-end")}>
        <button
          onClick={handleClick}
          data-bs-toggle="modal"
          data-bs-target="#infoModal"
          className={classNames("btn", "btn-info")}
        >
          {messages.settings.save}
        </button>
      </div>
    </>
  );
}

export default SettingsUI;
