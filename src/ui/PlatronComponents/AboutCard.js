import React from "react";
import cn from "classnames";
import { Card } from "react-bootstrap";

export function AboutCard(props) {
  const platformInfo = props.platformInfo;
  const messages = props.messages;

  function getChromeVersion() {
    const ua = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return ua ? parseInt(ua[2], 10) : false;
  }
  return (
    <Card className="mb-2">
      <Card.Body>
        <h6>
          {messages.info.appVersion}
          {platformInfo.appVersion}
        </h6>
        <h6>
          {messages.info.chromeVersion}
          {getChromeVersion()}
        </h6>
        <h6>
          {messages.info.osType}
          {platformInfo.os.type}
        </h6>
        <h6>
          {messages.info.osVersion}
          {platformInfo.os.release}
        </h6>
      </Card.Body>
    </Card>
  );
}
