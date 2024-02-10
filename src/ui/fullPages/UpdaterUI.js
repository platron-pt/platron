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
  console.log(messages);
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">{messages.update.checking}</span>
          </div>
          <h6 className="align-self-center mb-0">{messages.update.checking}</h6>
        </div>
      </div>
    </div>
  );
}

function UpdaterUI() {
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
      {showUpdater ? <Updater /> : null}
    </>
  );
}

export default UpdaterUI;
