import React, { useEffect } from "react";
import { LogBox } from "./PlatronComponents/LogBox";
import { Accordion } from "react-bootstrap";

function Logs(props) {
  const logGroups = props.logGroups;
  const setLogGroups = props.setLogGroups;

  useEffect(() => {
    const currentLogs = new Map(logGroups);
    api.handle("print-log", ([channel, text]) => {
      const currentText =
        currentLogs.get(channel) == undefined ? "" : currentLogs.get(channel);
      currentLogs.set(channel, currentText + text);
      setLogGroups(currentLogs);
    });

    return () => {
      api.removeIPCListener("print-log");
    };
  });

  const resultArr = [];
  logGroups.forEach((value, key) => {
    resultArr.push(
      <LogBox
        logGroups={logGroups}
        setLogGroups={setLogGroups}
        channel={key}
        logs={value}
        key={key}
      />
    );
  });

  return (
    <div id="log-box">
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        {resultArr}
      </Accordion>
    </div>
  );
}

export default Logs;
