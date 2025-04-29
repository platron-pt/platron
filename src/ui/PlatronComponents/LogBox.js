import cn from "classnames";
import React from "react";
import { Accordion, Button, ButtonGroup } from "react-bootstrap";
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
  function handleSaveClick(e) {
    api.invoke("open-folder-dialog").then((result) => {
      console.log(logs);
      if (!result.canceled) {
        const filePath = result.filePaths[0] + "/platron-" + channel + ".log";
        api.writeFile(filePath, logs);
      }
    });
  }

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
    <Accordion.Item eventKey={channel=="main" ? "0" : "1"}>
      <Accordion.Header>
        {channel}
      </Accordion.Header>
      <Accordion.Body id={"logs-" + channel}>
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
      </Accordion.Body>
    </Accordion.Item>
  );
}
