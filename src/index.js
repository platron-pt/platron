import themeControl from "./ui/theme.js";
import deviceParser from "./devices/deviceParser.js";
import jq from "jquery";
import keyPath2obj from "./keypath2obj.js";
import { oprs, availableLanguages, settings } from "./ui/UI.js";

import React from "react";
import ReactDOM from "react-dom/client";

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
const selectedADBDevices = new Set();
const selectedFbDevices = new Set();

function renderNavbar(elements) {
  const navbar = ReactDOM.createRoot(document.getElementById("navbar"));
  const categories = Object.keys(elements);

  function OperationTag({ category, operation }) {
    function handleClick() {
      switchOpr(`${category}.items.${operation}`);
    }

    return (
      <p
        className="operations user-select-none"
        value={`${category}.items.${operation}`}
        onClick={handleClick}
        key={operation}
      >
        {lang[category].items[operation].navbar}
      </p>
    );
  }

  function NavbarButton({ category }) {
    return (
      <div className="mb-3 categories-div" key={category}>
        <button
          className="btn btn-primary categories-btn"
          data-bs-toggle="collapse"
          data-bs-target={`#${category}-categories-collapse`}
        >
          {lang[category].navbar}
        </button>
        <div id={`${category}-categories-collapse`} className="collapse">
          {Object.keys(elements[category].items).map((e) => {
            return <OperationTag category={category} operation={e} key={e} />;
          })}
        </div>
      </div>
    );
  }
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
  switchOpr("settings.items.settings");
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

function switchOpr(keyPath) {
  curOpr = keyPath;
  let target = keyPath2obj(keyPath, oprs);
  let langTarget = keyPath2obj(keyPath, lang);
  const opArea = $("#operation-area");

  if (document.getElementById(keyPath) == null) {
    opArea.append(`<div id="${keyPath}" class="operation-box"></div>`);

    const subArea = document.getElementById(keyPath);
    generateTitle(opArea, langTarget.title, langTarget.subtitle);
    if (target.needUnlock) {
      $(subArea).append(
        `<div class="alert alert-info user-select-none">${messages.ui.unlockAlertMsg}</div>`
      );
    } else {
      $(subArea).append(`<div style="width:100%"></div>`);
    }
    if (keyPath == "fastboot.items.boot") {
      $(subArea).append(
        `<div class="alert alert-info" role="alert">${messages.tips.boot}</div>`
      );
    }
    if (keyPath == "fastboot.items.flash_remove_verity") {
      $(subArea).append(
        `<div class="alert alert-info" role="alert">${messages.tips.flash_remove_verity}</div>`
      );
    }

    if (
      keyPath !== "settings.items.settings" &&
      keyPath !== "settings.items.updater"
    ) {
      generateContents({
        from: opArea,
        content: target,
        translation: langTarget,
      });
    }

    $(subArea).append(`<div></div>`);
    if (!target.noStartButton) {
      $(subArea).append(
        `<button
      type="button"
      class="btn btn-primary startAction-btn border-0"
      id="${target.name}-btn"
      onclick="lib.runScript('${keyPath}','${target.name}')"
    >
      ${messages.ui.startBtn}
    </button>`
      );
    }
    if (keyPath == "settings.items.settings") {
      renderSettings(opArea, keyPath);
    } else {
      restartReminded = false;
    }
    if (keyPath == "settings.items.updater") {
      renderUpdater(opArea, keyPath);
    }
    checkUpdateClicked = false;
    updaterCreated = false;

    $("#operation-area")
      .find(`[id='${curOpr}-input']`)
      .on("focus", function (e) {
        e.stopPropagation();

        $(`[id='${curOpr}-other']`).prop("checked", true);
      });
    $("#operation-area")
      .find(`[id='${curOpr}-other']`)
      .on("click", function (e) {
        e.stopPropagation();
        $(`[id='${curOpr}-input']`).trigger("focus");
      });
  }
  for (let elm of document.getElementsByClassName("operation-box")) {
    elm.style.display = "none";
  }
  document.getElementById(keyPath).style.display = "";
  document.getElementsByClassName("do-not-hide")[0].style.display = "";
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
function readRadio(name) {
  const checkedRadio = document.querySelector(
    `input[name="${name}"]:checked`
  ).id;

  if (checkedRadio == curOpr + "-other") {
    return document.getElementById(curOpr + "-input").value;
  } else {
    return document.getElementById(checkedRadio).value;
  }
}
function readFileSelector(name) {
  return document.getElementById(curOpr + "-" + name).files[0].path;
}

export function cleanLogs(channel) {
  $(`#logs-item-${channel}`).remove();
}

const renderUI = () =>
  $(function () {
    api.handle("found-devices", (result) => {
      const mode = result[0];
      const returnText = result[1];
      let devicesFound = [];
      switch (mode) {
        case "adb":
          devicesFound = deviceParser.parseADB(returnText);
          break;
        case "fb":
          devicesFound = deviceParser.parseFB(returnText);
          break;
        default:
          break;
      }

      // [SN, mode]
      function showDevices(id, mode) {
        $(id).empty();
        let element = ``;
        devicesFound.forEach(([sn, stat], index) => {
          element += `<tr>
            <th scope="row">${index + 1}</th>
            <td>${sn}</td>
            <td>${stat}</td>
            <td><div class="form-check">
            <input class="form-check-input select-device-${mode}" type="checkbox" value="" id="${sn}"`;

          switch (mode) {
            case "adb":
              if (selectedADBDevices.has(sn)) {
                element += "checked";
              }
              break;
            case "fb":
              if (selectedFbDevices.has(sn)) {
                element += "checked";
              }
            default:
              break;
          }
          element += `></div></td></tr>`;
        });

        $(id).append(element);
      }

      switch (mode) {
        case "adb":
          showDevices("#ds-adb-tbody", mode);
          break;
        case "fb":
          showDevices("#ds-fb-tbody", mode);
          break;
        default:
          break;
      }
    });
    api.handle("print-log", ([channel, text]) => {
      printLogs(channel, text.replace(/\n/g, "</br>").replace(/ /g, "\u00a0"));
    });

    api.handle("updater-status", ([updaterStatus, updateInfo]) => {
      $("#eaf-updater").empty();
      switch (updaterStatus) {
        case "update-not-available":
          $("#eaf-updater").append(
            `<p class="h5">${messages.update.noUpdates}<p>`
          );
          break;
        case "update-available":
          $("#eaf-updater").append(`<p class="h5">${
            messages.update.updatingTo + updateInfo.version
          }<p><div
              class="spinner-border spinner-border-sm ms-auto"
              role="status"
              aria-hidden="true"
            ></div>`);
          break;
        case "update-downloaded":
          $("#eaf-updater").append(
            `<p class="h5">${messages.update.updateComplete}</h5>`
          );
      }
    });
    $("body").attr("data-bs-theme", theme);
    if (theme == "dark") {
      themeControl.setDark();
    } else {
      themeControl.setLight();
    }

    const deviceSelector = document.getElementById("device-selector");
    deviceSelector.addEventListener("show.bs.modal", (e) => {});

    $("#close-btn").on("click", (e) => {
      e.preventDefault();
      api.send("close-window");
    });
    $("#max-btn").on("click", (e) => {
      e.preventDefault();
      api.send("maximize-window");
    });
    $("#min-btn").on("click", (e) => {
      e.preventDefault();
      api.send("minimize-window");
    });
    $("#sidebar").width(screen.width / 7);
    $("#logs").width((screen.width / 5) * 2.5);
    $("#operation-area").width($("#operation-area").width() / 1.2);
    $(window).on("resize", function () {
      $("#main-content").css(
        "height",
        `calc(100vh - ${$("#winCtrl-bar").height()}px)`
      );
    });
    renderNavbar(oprs, language);
    $("#nothing-selected").text(messages.ui.nothingSelected);
    $("#devices-btn").text(messages.ui.deviceSelectorBtn);
    $("#ds-title").text(messages.devices.selectDevices);
    $("#ds-close-btn").text(messages.devices.closeBtn);
    $("#ds-save-btn").text(messages.devices.saveBtn);

    $("#ds-adb-tab").on("click", function () {
      dsMode = "adb";
    });
    $("#ds-fb-tab").on("click", function () {
      dsMode = "fb";
    });

    $("#ds-save-btn").on("click", function (e) {
      e.preventDefault();

      switch (dsMode) {
        case "adb":
          selectedADBDevices.clear();
          $(".select-device-adb:checked").each((index, element) => {
            selectedADBDevices.add(element.id);
          });
          break;
        case "fb":
          selectedFbDevices.clear();
          $(".select-device-fb:checked").each((index, element) => {
            selectedFbDevices.add(element.id);
          });

          break;
        default:
          break;
      }
    });
    $("#devices-btn,#reload-devices").on("click", () => {
      api.send("get-devices", "fb");
      api.send("get-devices", "adb");
    });

    api.send("resize");
  });

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
