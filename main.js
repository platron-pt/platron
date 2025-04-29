const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  nativeTheme,
  dialog,
} = require("electron");
const {
  PARAMS,
  VALUE,
  MicaBrowserWindow,
  IS_WINDOWS_11,
  WIN10,
} = require("mica-electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const child_process = require("child_process");
const fs = require("fs");
const os = require("os");
const platform = os.platform();
const { autoUpdater } = require("electron-updater");
const { INSPECT_MAX_BYTES, constants } = require("buffer");
const { connected, stderr } = require("process");
const { promisify } = require("node:util");
const promisifiedExec = promisify(child_process.execFile);
console.debug("Welcome to Platron v" + app.getVersion());

let config, updaterStatus, lang, messages;
console.log(process.cwd());
if (isPackaged) {
  config = require("../../config.json");
  updaterStatus = require("../../updaterStatus.json");
} else {
  config = require("./config.json");
  updaterStatus = require("./updaterStatus.json");
}

if (config.theme == "auto") {
  if (nativeTheme.shouldUseDarkColors) {
    config.exactTheme = "dark";
  } else {
    config.exactTheme = "light";
  }
} else {
  config.exactTheme = config.theme;
}

let channel = "";
let ptConfDir = path.join(os.homedir(), ".platron");
if (!fs.existsSync(ptConfDir)) {
  fs.mkdirSync(ptConfDir);
}
switch (config.variant) {
  case "beta": {
    if (!fs.existsSync(path.join(ptConfDir, "beta"))) {
      fs.closeSync(fs.openSync(path.join(ptConfDir, "beta"), "w"));
      channel = "beta";
    }
  }
  case "stable": {
    if (!fs.existsSync(path.join(ptConfDir, "beta"))) {
      channel = "latest";
    } else {
      channel = "beta";
    }
  }
}

if (!channel) {
  channel = "latest";
}
config.channel = channel;
console.debug("The update channel is " + channel);
autoUpdater.channel = channel;
autoUpdater.fullChangelog = true;

let hasDevtools = false;
let adbPath = "";
let fbPath = "";

if (platform == "win32") {
  adbPath = ".\\platform-tools-win\\adb.exe";
  fbPath = ".\\platform-tools-win\\fastboot.exe";
}

if (platform == "linux") {
  adbPath = "./platform-tools-linux/adb";
  fbPath = "./platform-tools-linux/fastboot";
}

if (!isPackaged || channel == "beta") {
  console.log("has DevTools!");
  hasDevtools = true;
}

const createWindow = () => {
  let win = {};
  console.log("OS Version", os.release());
  if (os.platform == "win32") {
    win = new MicaBrowserWindow({
      show: false,
      autoHideMenuBar: true,
      width: 1080,
      height: 500,
      minWidth: 1080,
      minHeight: 500,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        devTools: hasDevtools,
        icon: __dirname + "./res/img/icon_512.png",
      },
    });

    if (IS_WINDOWS_11) {
      console.log("Win11 detected.");

      if (config.exactTheme == "dark") {
        win.setDarkTheme();
      } else {
        win.setLightTheme();
      }
      win.setMicaEffect();
    } else {
      if (config.exactTheme == "dark") {
        win.setCustomEffect(WIN10.ACRYLIC, "#000", 0.4);
      } else {
        win.setCustomEffect(WIN10.ACRYLIC, "#fff", 0.4);
      }
    }
  } else {
    win = new BrowserWindow({
      // transparent: true,
      show: false,
      width: 1080,
      height: 500,
      minHeight: 500,
      minWidth: 1080,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        devTools: hasDevtools,
        icon: __dirname + "./res/img/icon_512.png",
      },
    });
  }

  // if (os.platform) win.setCustomEffect(WIN10.ACRYLIC, "#34ebc0", 0.4); // Acrylic

  if (isPackaged) {
    win.setMenu(null);
  }
  win.webContents.openDevTools({ mode: "undocked" });
  win.loadFile("dist/index.html");

  ipcMain.on("restart-app", () => {
    app.relaunch();
    app.quit();
  });
  ipcMain.on("close-window", () => {
    win.close();
  });
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("minimize-window", () => {
    win.minimize();
  });
  ipcMain.on("resize", () => {
    win.setSize(1080, 500);
  });

  ipcMain.on("run-command", (e, command, params) => {
    const process = child_process.spawn(command, params);
    process.stderr.on("data", (data) => {
      console.log(`${data}`);
      if (params[0] == "-s") {
        win.webContents.send("print-log", [params[1], `${data}`]);
      } else {
        win.webContents.send("print-log", ["main", `${data}`]);
      }
    });
    process.stdout.on("data", (data) => {
      console.log(`${data}`);
      if (params[0] == "-s") {
        win.webContents.send("print-log", [params[1], `${data}`]);
      } else {
        win.webContents.send("print-log", ["main", `${data}`]);
      }
    });
  });

  ipcMain.on("get-devices-v2", (e, mode) => {
    let exec = "";
    switch (mode) {
      case "adb":
        exec = adbPath;
        break;
      case "fb":
        exec = fbPath;
        break;
      default:
        break;
    }
    const process = child_process.execFile(
      exec,
      ["devices"],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }

        win.webContents.send("got-devices-v2", [mode, `${stdout}`]);
      }
    );
  });

  ipcMain.on("write-file", (e, fileName, data) => {
    console.log(fileName, data);
    writeFile(fileName, data);
  });

  ipcMain.on("check-updates", (e) => {
    autoUpdater.checkForUpdates();
  });
  ipcMain.on("test-log", (e, [channel, message]) => {
    win.webContents.send("print-log", [
      channel ? channel : "main",
      message + "\n",
    ]);
  });

  ipcMain.handle("get-devices", async (e, mode) => {
    let exec = "";
    switch (mode) {
      case "adb":
        exec = adbPath;
        break;
      case "fb":
        exec = fbPath;
        break;
      default:
        break;
    }

    const { stdout, stderr } = await getDevices(exec, ["devices"]);

    async function getDevices() {
      const { stdout, stderr } = await promisifiedExec(exec, ["devices"]);
      return { stdout: stdout, stderr: stderr };
    }
    return await getDevices();
  });
  ipcMain.handle("open-file-dialog", async (e, extension) => {
    const accepted = extension == undefined ? ["*"] : extension.split(",");
    return dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: [{ name: "Files", extensions: accepted }],
    });
  });
  ipcMain.handle("open-folder-dialog", async (e) => {
    return dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
  });
  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("updater-status", ["update-not-available", {}]);
  });

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("updater-status", ["update-available", info]);
  });

  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("updater-status", ["update-downloaded", info]);
  });

  win.show();
};

ipcMain.on("quit-beta", (e) => {
  fs.rm(path.join(ptConfDir, "beta"), (err) => {
    throw err;
  });
});

const platformInfo = {
  os: {
    type: os.type(),
    release: os.release(),
    platform: os.platform(),
  },
  appVersion: app.getVersion(),
};

ipcMain.handle("get-platform", async () => {
  return platform;
});
ipcMain.handle("get-version", async () => {
  return app.getVersion();
});
ipcMain.handle("get-os-type", async () => {
  return os.type();
});
ipcMain.handle("get-os-release", async () => {
  return os.release();
});

ipcMain.handle("get-platform-info", async () => {
  return platformInfo;
});

ipcMain.handle("get-config", async () => {
  console.log(config);
  return config;
});
ipcMain.handle("get-updater-status", async () => {
  return updaterStatus;
});
ipcMain.handle("is-packaged", async () => {
  return isPackaged;
});
ipcMain.handle("messages", async () => {
  return messages;
});
ipcMain.handle("language", async () => {
  return lang;
});

app.on("ready", () => {
  let processedLang;
  let locale = app.getLocale();
  if (config.language === "auto") {
    switch (locale) {
      case "zh-TW":
      case "en-US":
        processedLang = locale;
        break;
      default:
        processedLang = "en-US";
    }
  } else {
    processedLang = config.language;
  }
  if (isPackaged) {
    lang = require(`${__dirname}/res/json/lang/${processedLang}/lang.json`);
    messages = require(`${__dirname}/res/json/lang/${processedLang}/messages.json`);
  } else {
    lang = require(`${__dirname}/res/json/lang/${processedLang}/lang.json`);
    messages = require(`${__dirname}/res/json/lang/${processedLang}/messages.json`);
  }
});

app.whenReady().then(() => {
  const updateInterval = Date.now() - updaterStatus.lastUpdateCheck;
  const updateFrequency = Number(config.updateFrequency) * 24 * 60 * 60 * 1000;
  createWindow();
  if (updateInterval >= updateFrequency) {
    autoUpdater.checkForUpdatesAndNotify();
    updaterStatus.lastUpdateCheck = Date.now();
    writeFile("updaterStatus.json", JSON.stringify(updaterStatus, null, "  "));
  }
  console.log("starting ADB server");

  const adbServer = child_process.spawn(adbPath, ["start-server"]);
  adbServer.stderr.on("data", (data) => console.log(`${data}`.split("\n")[0]));

  app.on("before-quit", () => {
    console.log("Trying to kill adb server");
    child_process.execFile(
      adbPath,
      ["kill-server"],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      }
    );
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function writeFile(file, data) {
  try {
    fs.writeFile(file, data, (err) => {});
  } catch (err) {
    console.log(err);
  }
}
