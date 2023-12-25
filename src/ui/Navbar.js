import React from "react";

export function Navbar(props) {
  return (
    <>
      <button
        id="close-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("close-window")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="currentColor"
          className="bi bi-x-lg"
          viewBox="0 0 16 16"
        >
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
      </button>
      <button
        id="max-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("maximize-window")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="currentColor"
          className="bi bi-app"
          viewBox="0 0 16 16"
        >
          <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z" />
        </svg>
      </button>
      <button
        id="min-btn"
        className="winCtrl-btn border-0"
        onClick={() => api.send("minimize-window")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="currentColor"
          className="bi bi-dash-lg"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
          />
        </svg>
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
