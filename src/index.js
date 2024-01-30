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

let getPlatform;

let _version;
let osType;
let osRelease;
let messages;
let lang;
api.invoke("get-os-type").then((result) => (osType = result));
api.invoke("get-os-release").then((result) => (osRelease = result));
api.invoke("get-platform").then((result) => (getPlatform = result));
api.invoke("get-version").then((result) => (_version = result));
api.invoke("messages").then((res) => {
  messages = res;
});
api.invoke("language").then((res) => {
  lang = res;
});

let config;
let language;
let theme;

let checkUpdateClicked = false;
let updaterCreated = false;
let restartReminded = false;
let curOpr = "";

let dsMode = "adb";
window.selectedADBDevices = new Set();
window.selectedFbDevices = new Set();

function renderNavbar(elements) {
  const navbarRoot = ReactDOM.createRoot(document.getElementById("navbar"));
  const categories = Object.keys(elements);
  const NavbarButtons = categories.map((e) => {
    return <NavbarButton category={e} key={e} />;
  });

  navbar.render(NavbarButtons);
}

function generateTitle(opArea, title, subtitle) {
  let keyPath = curOpr;
  const subArea = document.getElementById(`${keyPath}`);
  $(subArea).append(`<h4 id="${keyPath}-title">${title}</h4>`);
  if (subtitle != undefined) {
    $(subArea).append(
      `<h5 id="${keyPath}-subtitle" class="text-muted">${subtitle}</h5>`
    );
    $("#operation-area").find(`#${keyPath}-subtitle`).addClass("mb-3");
  } else {
    $("#operation-area").find(`${keyPath}-title`).addClass("mb-3");
  }
}
export function updateFilePath() {
  document.getElementById(curOpr + "-file-path").innerHTML =
    document.getElementById(curOpr + "-file-input").files[0].path;
}
function generateContents(options) {
  const opArea = options.from;
  let keyPath = curOpr;
  const contents = options.content.content;
  const translations = options.translation.content;
  const subArea = document.getElementById(keyPath);

  for (let [index, content] of contents.entries()) {
    const translation = translations[index];

    switch (content.type) {
      case "radio":
        const radio = `<div class="form-check">
                        <input class="form-check-input ${keyPath}" type="radio" name="${options.content.name}" id="${keyPath}-${content.value}" value="${content.value}">
                        <label class="form-check-label" for="${keyPath}-${content.value}">
                          ${translation.text}
                        </label>
                      </div>`;
        $(subArea).append(radio);
        // 若 UI.js 中 content 下第三項爲 checked 則將其設爲“已經勾選”
        if (content.misc == "checked") {
          document
            .getElementById(`${keyPath}-${content.value}`)
            .setAttribute("checked", true);
        }
        break;
      case "input":
        $(subArea).append(`
        <input id="${keyPath}-${content.value}" class="extra-input mb-3 ${keyPath}" type="text" placeholder="${translation.misc}" >
        `);
        break;
      case "file":
        $(subArea).append(`<div class="mb-3">
          <label class="btn btn-primary" for="${keyPath}-file-input">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
            <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
          </svg>
            ${messages.ui.fileSelectorBtn}
          </label>
          <input class="d-none file-input ${keyPath}" onchange="lib.updateFilePath('${keyPath}')" type="file" name="${options.content.name}" id="${keyPath}-file-input" accept="${content.misc}"/>
          <h5 id="${keyPath}-file-path" class="user-select-none ${keyPath}">${messages.ui.fileSelectorDefault}</h5>
        </div>`);
        break;
      default:
        break;
    }
  }
}

export function updateSettings(name, value) {
  config[name] = value;

  saveSettings();
  document.getElementById("settings.items.settings").remove();
  restartReminded = true;
  // switchOpr("settings.items.settings");
}
export function quitBeta() {
  api.send("quit-beta");
  printLogs("main", messages.alert.restartAlert);
}
function generateSettings(opArea) {
  Object.keys(settings).forEach((e) => {
    const curSet = settings[e];
    switch (curSet.type) {
      case "dropdown":
        opArea.append(`<h6>${messages.settings[curSet.name]}
        <div class="dropdown mb-2 d-inline">
          <button class="btn btn-secondary dropdown-toggle d-inline" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${config[curSet.name]}
          </button>

          <ul class="dropdown-menu" id="${curSet.name}-menu">
          
          </ul>
        </div>
        
        </h6>
        
        `);
        for (let i of curSet.options) {
          $(`#${curSet.name}-menu`).append(`<li>
            <a class="dropdown-item" href="javascript:void(0)" onclick="lib.updateSettings('${curSet.name}','${i}')">${i}</a>
          </li>`);
        }
      default:
        break;
    }
  });
  if (config.variant == "stable") {
    if (config.channel == "beta") {
      opArea.append(
        `<button class="btn btn-warning mb-1" onclick="lib.quitBeta();">${messages.settings.quitBeta}</button>`
      );
    }
  }
}
function renderAbouts(opArea) {
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

  const crVersion = parseInt(raw[2], 10);
  opArea.append(`<div class="card mb-2">
    <div class="card-body">
      <h6 class="card-title">${messages.info.appVersion}${_version}</h6>
      <h6 class="card-title">${messages.info.chromeVersion}${crVersion}</h6>
      <h6 class="card-title">${messages.info.osType}${osType}</h6>
      <h6 class="card-title">${messages.info.osVersion}${osRelease}</h6>
    </div>
  </div>`);
}

function saveSettings() {
  api.writeFile("./config.json", JSON.stringify(config, null, "  "));
  if (!restartReminded) {
    printLogs("main", messages.alert.restartAlert);
  }
}

function renderUpdater(opArea, keyPath) {
  const subArea = document.getElementById(keyPath);
  $(subArea).append(`
    <div class="alert alert-info" role="alert">
      ${messages.update.deprecated}
    </div>
    <button class="btn btn-info mb-2" onclick="lib.checkUpdatesUI();" >${messages.update.updateEafBtn}</button>
  `);
}

export async function checkUpdatesUI() {
  const subArea = document.getElementById("settings.items.updater");
  if (!checkUpdateClicked) {
    if (!updaterCreated) {
      $(subArea).append(`<div class="card mb-2">
  <div id="eaf-updater" class="card-body">
  <div class="d-flex align-items-center m-2">
    <p class="mb-0 h5 text-muted">${messages.update.checkingUpdate}</p>
    <div
      class="spinner-border spinner-border-sm ms-auto"
      role="status"
      aria-hidden="true"
    ></div>
  </div>
  </div>`);
    }
    updaterCreated = true;
  }
  api.send("check-updates");
  checkUpdateClicked = true;
}

function renderSettings(opArea, keyPath) {
  const subArea = document.getElementById(keyPath);
  generateSettings($(subArea));
  renderAbouts($(subArea));
}

function printLogs(channel, data) {
  const logsOutput = document.getElementById("logs-output");
  console.log(String(data));
  if (!$(`#logs-${channel}`).length) {
    $("#logs-with-channels")
      .append(`<div class="accordion-item" id="logs-item-${channel}">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#logs-${channel}"
      aria-expanded="true" aria-controls="collapseOne">
      ${channel}
    </button>
  </h2>
  <div id="logs-${channel}" class="accordion-collapse collapse">
    <div class="accordion-body logs-body">
      <p id="logs-body-${channel}" class="font-monospace"></p>
      <button class="btn btn-primary float-end" onclick="lib.cleanLogs('${channel}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg></button>
    </div>
  </div>
</div>`);
  }
  $(`#logs-body-${channel}`).append(`${data}`);
}

export function runScript(path, name) {
  let fileExtension = "";
  let execDir = "";
  if (getPlatform == "win32") {
    execDir = ".\\platform-tools-win\\";
    fileExtension = ".exe";
  }
  if (getPlatform == "linux") {
    execDir = "./platform-tools-linux/";
  }
  const scripts = keyPath2obj(path, oprs).script;

  for (let commandList of scripts) {
    let params = [];
    let execFile = "";
    let operation = "";
    switch (commandList.mode) {
      case "adb":
        execFile = execDir + "adb" + fileExtension;
        break;
      case "fastboot":
        execFile = execDir + "fastboot" + fileExtension;
        break;
      default:
        break;
    }
    operation = commandList.verb;
    for (let param of commandList.params) {
      switch (param) {
        case "$radio":
          if (!(readRadio(name) == "system" && operation == "reboot")) {
            params.push(readRadio(name));
          }

          break;
        case "$file":
          params.push(readFileSelector("file-input"));
          break;
        default:
          params.push(param);
          break;
      }
    }
    let mode = path.split(".")[0];
    let hint = "Running command: ";
    hint += `${commandList.mode} ${commandList.verb}`;
    params.forEach((param) => (hint += " " + param));
    printLogs("main", hint + "</br>");
    switch (mode) {
      case "system":
        if (selectedADBDevices.size) {
          printLogs(
            "main",
            `Running on devices: ${Array.from(selectedADBDevices)}</br>`
          );
          for (let sn of selectedADBDevices) {
            api.runCommand(execFile, ["-s", sn, operation, ...params]);
          }
        } else {
          api.runCommand(execFile, [operation, ...params]);
        }
        break;
      case "recovery":
        if (selectedADBDevices.size) {
          printLogs(
            "main",
            `Running on devices: ${Array.from(selectedADBDevices)}</br>`
          );
          for (let sn of selectedADBDevices) {
            api.runCommand(execFile, ["-s", sn, operation, ...params]);
          }
        } else {
          api.runCommand(execFile, [operation, ...params]);
        }
        break;
      case "fastboot":
        console.log(selectedFbDevices.size);
        if (selectedFbDevices.size) {
          printLogs(
            "main",
            `Running on devices: ${Array.from(selectedFbDevices)}</br>`
          );
          for (let sn of selectedFbDevices) {
            api.runCommand(execFile, ["-s", sn, operation, ...params]);
          }
        } else {
          api.runCommand(execFile, [operation, ...params]);
        }
        break;
      default:
        break;
    }
  }
}

export function cleanLogs(channel) {
  $(`#logs-item-${channel}`).remove();
}

const renderUI = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  // const dsmRoot = ReactDOM.createRoot(document.getElementById("dsm"));
  // dsmRoot.render(
  //   <DeviceSelectorModal title={messages.devices.selectDevices} />
  // );
  // const navbarRoot = ReactDOM.createRoot(
  //   document.getElementById("winCtrl-bar")
  // );
  // navbarRoot.render(<Navbar dsbtn={messages.ui.deviceSelectorBtn} />);

  // const bigRoot = ReactDOM.createRoot(document.getElementById("bigRoot"));

  function BigRootElements() {
    const [currentOperation, setOperation] = useState("");
    return (
      <div id="main-content" className={classNames("d-flex","flex-row")}>
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
        />
        <Logs />
      </div>
    );
  }
  // bigRoot.render(<BigRootElements />);
  root.render(
    <>
      {/* Modal of device selector */}
      <DeviceSelectorModal title={messages.devices.selectDevices} />
      <div
        id="winCtrl-bar"
        className={classNames("d-flex", "flex-row-reverse")}
      >
        <Navbar dsbtn={messages.ui.deviceSelectorBtn} />
      </div>

      <BigRootElements />
    </>
  );

  $(function () {
    // api.handle("print-log", ([channel, text]) => {
    //   printLogs(channel, text.replace(/\n/g, "</br>").replace(/ /g, "\u00a0"));
    // });

    // api.handle("updater-status", ([updaterStatus, updateInfo]) => {
    //   $("#eaf-updater").empty();
    //   switch (updaterStatus) {
    //     case "update-not-available":
    //       $("#eaf-updater").append(
    //         `<p class="h5">${messages.update.noUpdates}<p>`
    //       );
    //       break;
    //     case "update-available":
    //       $("#eaf-updater").append(`<p class="h5">${
    //         messages.update.updatingTo + updateInfo.version
    //       }<p><div
    //           class="spinner-border spinner-border-sm ms-auto"
    //           role="status"
    //           aria-hidden="true"
    //         ></div>`);
    //       break;
    //     case "update-downloaded":
    //       $("#eaf-updater").append(
    //         `<p class="h5">${messages.update.updateComplete}</h5>`
    //       );
    //   }
    // });
    $("body").attr("data-bs-theme", theme);
    if (theme == "dark") {
      import("./css/dark.css");
    } else {
      import("./css/dark.css");
    }

    // $("#sidebar").width(screen.width / 7);
    // $("#logs").width((screen.width / 5) * 2.5);
    // $("#operation-area").width($("#operation-area").width() / 1.2);
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
