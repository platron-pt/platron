import classNames from "classnames";
import React from "react";

export function Navbar(props) {
  return (
    <>
      <button
        id="close-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("close-window")}
      >
        <i className={classNames("bi", "bi-x-lg")}></i>
      </button>
      <button
        id="max-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("maximize-window")}
      >
        <i className={classNames("bi", "bi-app")}></i>
      </button>
      <button
        id="min-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("minimize-window")}
      >
        <i className={classNames("bi", "bi-dash-lg")}></i>
      </button>
      <button
        className="btn btn-sm btn-primary py-1 m-1"
        id="devices-btn"
        data-bs-toggle="modal"
        data-bs-target="#device-selector"
      >
        <h6 className="mb-0">{props.dsbtn}</h6>
      </button>
      <div
        className="m-1 flex-fill align-middle"
        style={{ marginLeft: "0.5rem" }}
      >
        Easy ADB and Fastboot
      </div>
    </>
  );
}
