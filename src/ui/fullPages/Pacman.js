import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
function TItem({ name, num }) {
  return (
    <tr>
      <td>{num}</td>
      <td>{name}</td>
      <td>
        <Button variant="danger" size="sm">
          <i className="bi bi-trash"></i>
        </Button>
      </td>
    </tr>
  );
}
export function Pacman(props) {
  const config = props.config;
  const platformInfo = props.platformInfo;
  const messages = props.messages;
  const [packages, setPackages] = useState([]);

  let packageArray = [];
  const [toRefresh, setToRefresh] = useState(false);
  let fileExtension = "";
  let execDir = "";
  let adb = "";
  const [commonNames, setCommonNames] = useState([]);

  if (platformInfo.os.platform == "win32") {
    execDir = ".\\platform-tools-win\\";
    fileExtension = ".exe";
  }
  if (platformInfo.os.platform == "linux") {
    execDir = "./platform-tools-linux/";
  }
  adb = execDir + "adb" + fileExtension;
  // console.log(packages);

  const fetchPackages = () => {
    return new Promise((resolve, reject) => {
      if (toRefresh) {
        api
          .invoke("run-command-silent", [
            adb,
            ["shell", "pm", "list", "packages", "-3"],
          ])
          .then((result) => {
            const resultArray = result.split("\n").map((item) => {
              return item.replace("package:", "");
            });
            setPackages(resultArray);
            packageArray = [...resultArray];
            if (resultArray.length > 0) {
              setPackages(resultArray.slice(0, resultArray.length - 1));
              packageArray = resultArray.slice(0, resultArray.length - 1);
            }
            setToRefresh(false);

            resolve("OK");
          });
      }
    });
  };
  // package name to common name
  const winSplit = "\\";
  const posixSplit = "/";
  const aapt2 =
    "bin" +
    (platformInfo.os.platform == "win32" ? winSplit : posixSplit) +
    "aapt2";

  async function pName2CName(packageList) {
    let templist = [...packageList];
    await api.invoke("run-command-silent", [
      adb,
      ["push", aapt2, "/data/local/tmp/"],
    ]);
    await api.invoke("run-command-silent", [
      adb,
      ["shell", "chmod", "0755", "/data/local/tmp/aapt2"],
    ]);
    let apkPathProcessed = 0;
    api.send("test-log", ["main", messages.pacman.reading + "(1/2)"]);
    let apkPaths = await Promise.all(
      templist.map(async (element) => {
        const result = await api
          .invoke("run-command-silent", [
            adb,
            ["shell", "pm", "list", "package", "-f", element],
          ])
          .then((result) => {
            const tmpArray = result
              .split("\n")[0]
              .replace("package:", "")
              .split("=")
              .slice(0, -1);
            let apkPath = "";
            tmpArray.forEach((element, index) => {
              apkPath += element;
              if (index != tmpArray.length - 1) {
                apkPath += "=";
              }
            });
            apkPathProcessed += 1;
            if (apkPathProcessed % 100 == 0) {
              console.log("Path processed: " + apkPathProcessed);
              api.send("test-log", [
                "main",
                messages.pacman.apkProcessed +
                  apkPathProcessed.toString() +
                  messages.pacman.apkProcessed2,
              ]);
            }
            return apkPath;
          });

        return result;
      })
    );
    api.send("test-log", ["main", messages.pacman.reading + "(2/2)"]);
    apkPathProcessed = 0;
    let commonNamesArray = await Promise.all(
      apkPaths.map(async (element, index) => {
        const result = await api
          .invoke("run-command-silent", [
            adb,
            ["shell", "/data/local/tmp/aapt2", "dump", "badging", element],
          ])
          .catch((error) => {
            return "";
          })
          .then((result) => {
            const tmpArray = result.split("\n");
            let commonName = "";
            // console.log("application-label-" + config.language);
            tmpArray.forEach((element, index) => {
              if (
                element.indexOf("application-label-" + config.language) >= 0
              ) {
                commonName = element.split(":")[1].replace(/'/g, "");
                console.log(commonName);
                return commonName;
              } else {
                tmpArray.forEach((element, index) => {
                  if (element.indexOf("application-label") >= 0) {
                    commonName = element.split(":")[1].replace(/'/g, "");
                    return commonName;
                  }
                });
              }
            });
            apkPathProcessed += 1;
            if (apkPathProcessed % 100 == 0) {
              console.log("Path processed: " + apkPathProcessed);
              api.send("test-log", [
                "main",
                messages.pacman.apkProcessed +
                  apkPathProcessed.toString() +
                  messages.pacman.apkProcessed2,
              ]);
            }
            return commonName;
          });
        return result;
      })
    );
    setCommonNames(commonNamesArray);
    api.invoke("run-command-silent", [
      adb,
      ["shell", "rm", "/data/local/tmp/aapt2"],
    ]);
  }

  useEffect(() => {
    async function runEffect() {
      await fetchPackages();
      pName2CName(packageArray);
    }
    runEffect();
  }, [toRefresh]);

  return (
    <>
      <div className="d-flex flex-row">
        <Button
          variant="info" size="sm"
          className="me-2"
          onClick={() => setToRefresh(true)}
        >
          {messages.pacman.start}
        </Button>
        <Button variant="primary" size="sm">{messages.pacman.install}</Button>
      </div>

      <Table striped hover variant={config.exactTheme}>
        <thead>
          <tr>
            <th>#</th>
            <th>{messages.pacman.name}</th>
            <th>{messages.pacman.operation}</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((element, index) => {
            let nameShown = commonNames[index] ? commonNames[index] : element;
            return (
              <TItem
                key={element}
                name={nameShown}
                packageName={element}
                num={index + 1}
              />
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
