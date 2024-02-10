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

const merge = require("deepmerge");

let platformInfo = {};

api.invoke("get-platform-info").then((result) => {
  platformInfo = result;
});

let appSettings = require("../config.json");
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

if (appSettings.theme === "auto") {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  } else {
    theme = "light";
  }
}

const messages = require("../res/json/lang/" + appLanguage + "/messages.json");
const lang = require("../res/json/lang/" + appLanguage + "/lang.json");

let dsMode = "adb";

function renderUI() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  function BigRootElements(props) {
    const [currentOperation, setOperation] = useState("");
    const [logGroups, setLogGroups] = useState(() => new Map([["main", ""]]));

    return (
      <div id="main-content" className={classNames("d-flex", "flex-row")}>
        <div id="sidebar">
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

    useEffect(() => {
      api.writeFile("config.json", JSON.stringify(config, null, "  "));
    }, [config]);

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

  setTimeout(() => {
    console.log(platformInfo);
    if (platformInfo.os.platform == "win32") {
      import("./css/acrylic.css");
    }
  }, 10);
}

export function restartApp() {
  api.send("restart-app");
}

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
renderUI();
