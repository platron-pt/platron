import classNames from "classnames";
import React from "react";

import icons from "../../res/icons/icons";

export function Navbar(props) {
  function handleClick() {
    api.send("get-devices-v2", "adb")
    api.send("get-devices-v2", "fb")
  }
  return (
    <>
      <button
        id="close-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("close-window")}
      >
        <icons.X_lg></icons.X_lg>
      </button>
      <button
        id="max-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("maximize-window")}
      >
       <icons.App></icons.App>
      </button>
      <button
        id="min-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("minimize-window")}
      >
      <icons.Dash_lg></icons.Dash_lg>
      </button>
      <button
        className="btn btn-sm btn-primary py-1 m-1"
        id="devices-btn"
        data-bs-toggle="modal"
        data-bs-target="#device-selector"
        onClick={handleClick}
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
