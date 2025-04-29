import cn from "classnames";
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useState } from "react";

export function LogBox(props) {
  const logGroups = props.logGroups;
  const setLogGroups = props.setLogGroups;
  const channel = props.channel;
  const logs = props.logs;
  const [copyIcon, setCopyIcon] = useState("bi-clipboard2");

  function handleCopyClick(e) {
    navigator.clipboard.writeText(logs);
    new Promise((resolve) => {
      setCopyIcon("bi-check-lg");
      setTimeout(() => {
        resolve();
      }, 3000);
    }).then(() => {
      setCopyIcon("bi-clipboard2");
    });
  }
  function handleSaveClick(e) {}

  function handleDeleteClick(e) {
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
          className={cn("accordion-button", "collapsed")}
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
        className={cn("accordion-collapse", "collapse")}
      >
        <div className={cn("accordion-body")}>
          <p
            id={"logs-body" + channel}
            className="font-monospace logs-body"
            style={{ whiteSpace: "pre" }}
          >
            {logs}
          </p>
          <div className="d-flex justify-content-end">
            <ButtonGroup>
              <Button variant="primary" onClick={handleCopyClick}>
                <i className={cn("bi", copyIcon)}></i>
              </Button>
              <Button variant="primary" onClick={handleSaveClick}>
                <i className="bi bi-floppy"></i>
              </Button>
              <Button variant="primary" onClick={handleDeleteClick}>
                {channel == "main" ? (
                  <i className="bi bi-trash"></i>
                ) : (
                  <i className="bi bi-x-lg"></i>
                )}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
