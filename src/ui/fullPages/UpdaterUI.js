import classNames from "classnames";
import React, { useEffect, useState } from "react";

let appSettings = require("../../../config.json");
let theme = appSettings.theme;
let appLanguage = appSettings.language;
if (appSettings.language === "auto") {
  switch (navigator.language) {
    case "zh-TW":
    case "en-US":
      appLanguage = navigator.language;
      break;
    default:
      appLanguage = "en-US";
  }
}

const messages = require("../../../res/json/lang/" +
  appLanguage +
  "/messages.json");

function Updater(props) {
  const currentVersion = props.currentVersion;
  const updateStatus = props.updateStatus;
  const updateInfo = props.updateInfo;

  let resultText = "";
  switch (updateStatus) {
    case "":
      resultText = messages.update.checking;
      break;
    case "update-available":
      resultText = messages.update.updating;
      resultText += currentVersion + "→" + updateInfo.version;
      break;
    case "update-downloaded":
      resultText = messages.update.completed;
      resultText += currentVersion + "→" + updateInfo.version;
      break;
  }

  console.log(messages);
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex">
          {updateStatus == "update-downloaded" ? null : (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">
                {messages.update.checking}
              </span>
            </div>
          )}
          <h6 className="mb-0">{resultText}</h6>
        </div>
      </div>
    </div>
  );
}

function UpdaterUI(props) {
  const [showUpdater, setShowUpdater] = useState(false);

  function handleClick(e) {
    setShowUpdater(true);
    api.send("check-updates");
  }

  return (
    <>
      <button
        className={classNames("btn", "btn-info", "mb-2")}
        onClick={handleClick}
      >
        {messages.update.updateBtn}
      </button>
      {showUpdater ? (
        <Updater
          currentVersion={props.platformInfo.appVersion}
          updateStatus={props.updateStatus}
          updateInfo={props.updateInfo}
        />
      ) : null}
    </>
  );
}

export default UpdaterUI;
