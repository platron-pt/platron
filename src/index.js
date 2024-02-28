import deviceParser from "./devices/deviceParser.js";
import keyPath2obj from "./keypath2obj.js";
import { oprs, settings } from "./ui/UI.js";
import { OperationArea } from "./ui/OperationArea.js";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import DeviceSelectorModal from "./ui/deviceSelector";
import { Navbar } from "./ui/Navbar.js";

import "./css/index.scss";

import * as bootstrap from "bootstrap";

import { NavbarButton } from "./ui/Sidebar.js";
import classNames from "classnames";
import Logs from "./ui/Logs.js";
import InfoModal from "./ui/InfoModal.js";

let appSettings = {};

const merge = require("deepmerge");

let platformInfo = {};

const getPlatform = new Promise((resolve, reject) => {
  api.invoke("get-platform-info").then((result) => {
    platformInfo = result;
    resolve("ok");
  });
});

const getConfig = new Promise((resolve, reject) => {
  api.invoke("get-config").then((res) => {
    appSettings = res;
    resolve("ok");
  });
});

let theme = "";
let appLanguage = "";
let messages = {};
let lang = {};

// let appSettings = require("../config.json");

Promise.all([getConfig, getPlatform]).then((values) => {
  if (appSettings.language === "auto") {
    switch (navigator.language) {
      case "zh-TW":
      case "en-US":
      case "zh-CN":
        appLanguage = navigator.language;
        break;
      default:
        appLanguage = "en-US";
    }
  } else {
    appLanguage = appSettings.language;
  }

  theme = appSettings.exactTheme;

  switch (appLanguage) {
    case "zh-TW":
      messages = require("../res/json/lang/zh-TW/messages.json");
      lang = require("../res/json/lang/zh-TW/lang.json");
      break;
    case "zh-CN":
      messages = require("../res/json/lang/zh-CN/messages.json");
      lang = require("../res/json/lang/zh-CN/lang.json");
      break;
    case "en-US":
      messages = require("../res/json/lang/en-US/messages.json");
      lang = require("../res/json/lang/en-US/lang.json");
      break;
  }

  renderUI();
});

let dsMode = "adb";

function renderUI() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  function BigRootElements(props) {
    const [currentOperation, setOperation] = useState("");
    const [logGroups, setLogGroups] = useState(() => new Map([["main", ""]]));

    return (
      <div
        id="main-content"
        className={classNames(
          "d-flex",
          "flex-row",
          "position-relative",
          "bottom-0",
          "h-100",
          "overflow-hidden"
        )}
      >
        <div id="sidebar" className={classNames("float-left", "overflow-auto")}>
          <div className="container">
            <nav id="sidebar" className={classNames("nav", "flex-column")}>
              {Object.keys(oprs).map((e) => {
                return (
                  <NavbarButton
                    category={e}
                    elements={oprs[e]}
                    key={e}
                    lang={lang[e]}
                    setOperation={setOperation}
                  />
                );
              })}
            </nav>
          </div>
        </div>
        <OperationArea
          lang={lang}
          msg={messages}
          currentOperation={currentOperation}
          logGroups={logGroups}
          setLogGroups={setLogGroups}
          selectedDevices={props.selectedDevices}
          platformInfo={platformInfo}
          config={props.config}
          setConfig={props.setConfig}
          messages={props.messages}
          updateStatus={props.updateStatus}
          updateInfo={props.updateInfo}
        />
        <Logs logGroups={logGroups} setLogGroups={setLogGroups} />
      </div>
    );
  }

  function App() {
    // (get/set)(found/selected)(adb/fb)
    const [gfa, sfa] = useState([]);
    const [gff, sff] = useState([]);

    const [selectedDevices, setSelectedDevices] = useState(() => new Set());

    const [config, setConfig] = useState(merge({}, appSettings));

    const [updateStatus, setUpdateStatus] = useState("");
    const [updateInfo, setUpdateInfo] = useState({});

    const [modalTitle, setModalTitle] = useState(messages.alert.infoTitle);
    const [modalContent, setModalContent] = useState(
      messages.alert.restartAlert
    );

    useEffect(() => {
      api.handle("updater-status", (res) => {
        setUpdateStatus(res[0]);
        setUpdateInfo(res[1]);
      });
      return () => {
        api.removeIPCListener("updater-status");
      };
    });

    return (
      <>
        {/* Modal of device selector */}
        <InfoModal
          modalTitle={modalTitle}
          modalContent={modalContent}
          dismissBtn={messages.alert.dismiss}
        />
        <DeviceSelectorModal
          title={messages.devices.selectDevices}
          gfa={gfa}
          sfa={sfa}
          gff={gff}
          sff={sff}
          selectedDevices={selectedDevices}
          setSelectedDevices={setSelectedDevices}
        />
        <div
          id="winCtrl-bar"
          className={classNames("d-flex", "flex-row-reverse")}
        >
          <Navbar dsbtn={messages.ui.deviceSelectorBtn} />
        </div>

        <BigRootElements
          selectedDevices={selectedDevices}
          foundADBDevices={gfa}
          foundFBDevices={gff}
          config={config}
          setConfig={setConfig}
          messages={messages}
          updateStatus={updateStatus}
          updateInfo={updateInfo}
        />
      </>
    );
  }

  root.render(<App />);

  document.body.setAttribute("data-bs-theme", theme);
  if (theme == "dark") {
    import("./css/dark.css");
  } else {
    import("./css/dark.css");
  }

  if (platformInfo.os.platform == "win32") {
    import("./css/acrylic.css");
  }
}

export function restartApp() {
  api.send("restart-app");
}

const root = document.createElement("div");
root.setAttribute("id", "root");
root.setAttribute("class", "h-100 overflow-hidden");
document.body.appendChild(root);
