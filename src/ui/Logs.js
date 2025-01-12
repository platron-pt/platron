import React, { useEffect } from "react";
import classNames from "classnames";

import icons from "../../res/icons/icons";

function LogBox(props) {
  const logGroups = props.logGroups;
  const setLogGroups = props.setLogGroups;
  const channel = props.channel;
  const logs = props.logs;

  function handleClick(e) {
    const currentLogs = new Map(logGroups);
    if (channel == "main") {
      currentLogs.set(channel, "");
    } else {
      currentLogs.delete(channel);
    }

    setLogGroups(currentLogs);
  }

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={classNames("accordion-button", "collapsed")}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#logs-" + channel}
          aria-expanded="true"
        >
          {channel}
        </button>
      </h2>
      <div
        id={"logs-" + channel}
        className={classNames("accordion-collapse", "collapse")}
      >
        <div className={classNames("accordion-body")}>
          <p
            id={"logs-body" + channel}
            className="font-monospace logs-body"
            style={{ whiteSpace: "pre" }}
          >
            {logs}
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleClick}>
              {channel == "main" ? (
                <icons.Trash_lg></icons.Trash_lg>
              ) : (
                <icons.X_lg></icons.X_lg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="accordion">{resultArr}</div>
    </div>
  );
}

export default Logs;
