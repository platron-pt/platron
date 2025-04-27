import React from "react";
import cn from "classnames";

export function AboutCard(props) {
  const platformInfo = props.platformInfo;
  const messages = props.messages;

  function getChromeVersion() {
    const ua = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return ua ? parseInt(ua[2], 10) : false;
  }
  return (
    <div className={cn("card", "mb-2")}>
      <div className="card-body">
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
      </div>
    </div>
  );
}