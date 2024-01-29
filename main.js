const { app, BrowserWindow, ipcMain, shell } = require("electron");
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
const { connected } = require("process");
const { promisify } = require("node:util");
const promisifiedExec = promisify(child_process.execFile);
console.debug("Welcome to EAF v" + app.getVersion());

let config, updaterStatus, lang, messages;
if (isPackaged) {
  config = require("../../config.json");
  updaterStatus = require("../../updaterStatus.json");
} else {
  config = require("./config.json");
  updaterStatus = require("./updaterStatus.json");
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
  hasDevtools = true;
}

const createWindow = () => {
  let win = {};
  console.log("OS Version", os.release());
  if (false) {
    win = new MicaBrowserWindow({
      show: false,
      autoHideMenuBar: true,
      width: 1080,
      height: 501,
      minWidth: 1080,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        devTools: hasDevtools,
        icon: __dirname + "./favicon_256.ico",
      },
    });

    if (IS_WINDOWS_11) {
      console.log("Win11 detected.");
      console.log(config.theme);

      if (config.theme == "dark") {
        console.log("dark");
        win.setDarkTheme();
      } else {
        console.log("light");
        win.setLightTheme();
      }
      win.setMicaEffect();
    } else {
      win.setAcrylic();
    }
  } else {
    win = new BrowserWindow({
      // transparent: true,
      show: false,
      width: 1080,
      height: 500,
      minWidth: 1080,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        devTools: hasDevtools,
        icon: __dirname + "./favicon_256.ico",
      },
    });
  }

  // if (os.platform) win.setCustomEffect(WIN10.ACRYLIC, "#34ebc0", 0.4); // Acrylic

  if (isPackaged) {
    win.setMenu(null);
  }
  win.webContents.openDevTools({ mode: "undocked" });
  win.loadFile("index.html");

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
  ipcMain.on("write-file", (e, fileName, data) => {
    writeFile(fileName, data);
  });

  ipcMain.on("check-updates", (e) => {
    autoUpdater.checkForUpdates();
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
      return({stdout:stdout,stderr:stderr})
    }
    return await getDevices();
  });
  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("updater-status", ["update-not-available", {}]);
  });

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("updater-status", ["update-available", info]);
  });

  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("updater-status", ["update-downloaded", {}]);
  });
  win.show();
};

ipcMain.on("quit-beta", (e) => {
  fs.rm(path.join(ptConfDir, "beta"), (err) => {
    throw err;
  });
});

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
ipcMain.handle("get-config", async () => {
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
