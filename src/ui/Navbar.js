import classNames from "classnames";
import React from "react";


export function Navbar(props) {
  function handleClick() {
    api.send("get-devices-v2", "adb");
    api.send("get-devices-v2", "fb");
  }
  return (
    <>
      <button
        id="close-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("close-window")}
      >
        <i className="bi bi-x-lg"></i>
      </button>
      <button
        id="max-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("maximize-window")}
      >
        <i className="bi bi-app"></i>
      </button>
      <button
        id="min-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("minimize-window")}
      >
        <i className="bi bi-dash-lg"></i>
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
        className={classNames(
          "m-1",
          "flex-fill",
          "d-flex",
          "align-items-center"
        )}
      >
        <p className="ms-1 mb-0">Platron</p>
      </div>
    </>
  );
}
