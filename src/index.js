import deviceParser from "./devices/deviceParser.js";
import jq from "jquery";
import keyPath2obj from "./keypath2obj.js";
import { oprs, availableLanguages, settings } from "./ui/UI.js";
import { OperationArea } from "./ui/OperationArea.js";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import DeviceSelectorModal from "./ui/deviceSelector";
import { Navbar } from "./ui/Navbar.js";

import "./css/index.scss";

import * as bootstrap from "bootstrap";

import { NavbarButton } from "./ui/Sidebar.js";
import classNames from "classnames";
import Logs from "./ui/Logs.js";

window.$ = window.jQuery = jq;

let messages;
let lang;

let platformInfo = {};

api.invoke("get-platform-info").then((result) => {
  platformInfo = result;
});

api.invoke("messages").then((res) => {
  messages = res;
});
api.invoke("language").then((res) => {
  lang = res;
});

let config;
let language;
let theme;


let dsMode = "adb";

const renderUI = () => {
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
        />
      </>
    );
  }

  root.render(<App />);

  $(function () {
    document.body.setAttribute("data-bs-theme", theme);
    if (theme == "dark") {
      import("./css/dark.css");
    } else {
      import("./css/dark.css");
    }
  });
};

export function restartApp() {
  api.send("restart-app");
}

Promise.all([api.invoke("get-config")]).then((resultArr) => {
  config = resultArr[0];
  language = config.language;
  theme = config.theme;
  if (config.language === "auto") {
    switch (navigator.language) {
      case "zh-TW":
      case "en-US":
        language = navigator.language;
        break;
      default:
        language = "en-US";
    }
  }

  if (config.theme === "auto") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    } else {
      theme = "light";
    }
  }
  renderUI();
});
