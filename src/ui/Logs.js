import React, { useState } from "react";
import classNames from "classnames";
import { Logger } from "sass";

function LogBox(props) {
  const channel = props.channel;

  function handleClick(e) {
    console.log(e);
  }

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button"
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
        <div className={classNames("accordion-body", "logs-body")}>
          <p id={"logs-body" + channel} className="font-monospace"></p>
          <button class="btn btn-primary float-end" onClick={handleClick}>
            <i className={classNames("bi", "bi-x-lg")}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function Logs() {
  const [logGroups, setLogGroups] = useState([{ channel: "main", logs: [] }]);
  return (
    <div id="log-box">
      <div className="accordion">
        {logGroups.map((element) => {
          return<LogBox channel={element.channel} logs={element.logs} />;
        })}
      </div>
    </div>
  );
}

export default Logs;
