const {
  existsSync,
  rmSync,
  writeFileSync,
  createWriteStream,
  createReadStream,
  mkdirSync,
  write,
  renameSync,
} = require("fs");
const { type } = require("os");
const { https } = require("follow-redirects");
const builder = require("electron-builder");
const args = require("args-parser")(process.argv);
const buildInfo = require("./build.json");
const appConfig = require("../default_config.json");
const updaterStatus = require("../default_updaterStatus.json");
const child_process = require("child_process");
const { promisify } = require("node:util");
const spawnAsync = promisify(child_process.spawn);
const os = require("node:os");

const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      console.log(`Downloading from ${url}`);
      res.pipe(file);
      file.on("finish", () => {
        resolve("Download completed");
      });
    });
  });

const decompress = require("decompress");

async function main() {
  if (args.h) {
    console.log("");
    console.log("=== Platron Build Script ===");
    console.log("");
    console.log("-h    Display this message.");
    console.log("");
    console.log("-b    Build with configs.");
    console.log("-d    Download platform-tools (Automatically detect OS)");
    console.log(
      '-v    Set build variant. "stable" and "beta" are suggested, otherwise you have to modify the source code.'
    );
    console.log("-p    Make electron-builder to publish or not.");
    console.log("-w    Set webpack to developement/production mode.");
    console.log("");
    console.log("Example: node ./script/platronMaker.js -v=beta -d");
  } else {
    if (args.d) {
      const downloadPT = new Promise((resolve, reject) => {
        // download platform-tools
        console.log("Start downloading platform-tools");
        let downloadProcess;
        const platform = type();
        switch (platform) {
          case "Linux":
            downloadProcess = downloadFile(
              "https://dl.google.com/android/repository/platform-tools-latest-linux.zip",
              "platform-tools.zip"
            );
            break;
          case "Windows_NT":
            downloadProcess = downloadFile(
              "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
              "platform-tools.zip"
            );
            break;
          default:
            reject("Platform currently not supported!");
            break;
        }

        downloadProcess.then((result) => {
          console.log(result);
          if (existsSync("platform-tools.zip")) {
            console.log("Unzipping platform-tools.zip");
            decompress("platform-tools.zip", ".")
              .then((files) => {
                switch (platform) {
                  case "Linux":
                    ``;
                    rmSync("platform-tools-linux", {
                      recursive: true,
                      force: true,
                    });
                    renameSync("platform-tools", "platform-tools-linux");
                    break;
                  case "Windows_NT":
                    rmSync("platform-tools-win", {
                      recursive: true,
                      force: true,
                    });
                    renameSync("platform-tools", "platform-tools-win");
                    break;
                  default:
                    break;
                }
                resolve("Unzip finished");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      });
      await downloadPT
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const checkArgs = new Promise((resolve, reject) => {
      let checkFlag = 1;
      if (!!args.v) {
        checkFlag *= 2;
      }

      const toSet = [];
      if (checkFlag % 2) {
        toSet.push("Build Variant");
      }
      if (checkFlag % 2) {
        reject("Wrong " + toSet.toString() + ".");
      } else {
        appConfig.variant = args.v;
        resolve("Configuration OK.");
      }
    });
    await checkArgs
      .then((result) => {
        console.log(result);

        writeFileSync("config.json", JSON.stringify(appConfig, null, "  "));
        writeFileSync(
          "updaterStatus.json",
          JSON.stringify(updaterStatus, null, "  ")
        );
        if (args.b) {
          console.log("Start building");
          let checkFlag = 1;
          const rejectReason = [];
          if (!!args.w) {
            if (args.w == "production" || args.w == "development") {
              checkFlag *= 2;
            }
          }
          if (!!args.p) {
            if (args.p == "never" || args.p == "always") {
              checkFlag *= 3;
            }
          }
          if (checkFlag % 2) {
            rejectReason.push("-w");
          }
          if (checkFlag % 3) {
            rejectReason.push("-p");
          }

          if (checkFlag % 6) {
            console.log(rejectReason.toString(), "argument wrong.");
            console.log("For more info, please refer to platronMaker.js -h");
          } else {
            console.log(args.w + " mode");
            let npx = "npx";
            let options = {};
            if (os.platform() == "win32") {
              npx += ".cmd";
              Object.assign(options, { shell: true });
            }
            const webpackProcess = child_process.spawn(
              npx,
              ["webpack", "--mode=" + args.w],
              options
            );
            webpackProcess.stdout.on("data", (res) => {
              console.log(res.toString());
            });
            webpackProcess.stderr.on("data", (res) => {
              console.log(res.toString());
            });
            webpackProcess.on("close", (code) => {
              if (!code) {
                const buildProcess = child_process.spawn(
                  npx,
                  ["electron-builder", "build", "--publish", args.p],
                  options
                );
                buildProcess.stdout.on("data", (res) => {
                  console.log(res.toString());
                });
                buildProcess.stderr.on("data", (res) => {
                  console.log(res.toString());
                });
              }
            });
          }
        }
      })
      .catch((result) => {
        console.log(result);
      });
  }
}
main();
