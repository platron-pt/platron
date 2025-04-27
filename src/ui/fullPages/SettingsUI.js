import classNames from "classnames";
import React, { useState } from "react";
import { availableLanguages } from "../UI";
import { AboutCard } from "../PlatronComponents/AboutCard";
import { DropDownBtn } from "../PlatronComponents/DropDownBtn";
import { DevCard } from "../PlatronComponents/DevCard";

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
        <span className="align-self-center me-2">
          {messages.settings.language}
        </span>

        <DropDownBtn
          options={[...availableLanguages, "auto"]}
          config={config}
          setConfig={setConfig}
          configKey="language"
          optionsShowText={messages.settingsValues.language}
        />
      </div>
      <div className={classNames("d-flex", "mb-1")}>
        <span className="align-self-center me-2">
          {messages.settings.theme}
        </span>

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
      {config.variant == "beta" ? <DevCard messages={messages}></DevCard> : none}
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
