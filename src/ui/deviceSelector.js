import classNames from "classnames";
import React, { useEffect, useState } from "react";
import deviceParser from "../devices/deviceParser.js";

function Device(props) {
  const sn = props.sn;
  const stat = props.stat;
  const mode = props.mode;
  const checked = props.checked;
  const selectedDevices = new Set(props.selectedDevices);
  const setSelectedDevices = props.setSelectedDevices;
  const index = props.index;

  function handleChange(event) {
    event.target.checked ? selectedDevices.add(sn) : selectedDevices.delete(sn);
    setSelectedDevices(selectedDevices);
  }
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{sn}</td>
      <td>{stat}</td>
      <td>
        <div className="form-check">
          <input
            className={classNames("form-check-input", `select-device-${mode}`)}
            type="checkbox"
            value={sn}
            id={sn}
            defaultChecked={checked}
            onChange={handleChange}
          ></input>
        </div>
      </td>
    </tr>
  );
}

function DeviceTable(props) {
  const selectedDevices = props.selectedDevices;
  const setSelectedDevices = props.setSelectedDevices;
  const mode = props.mode;
  const foundDevices = props.foundDevices;

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">S/N</th>
          <th scope="col">Status</th>
          <th scope="col">Check</th>
        </tr>
      </thead>
      <tbody id={`ds-${mode}-tbody`}>
        {foundDevices.map((element, index) => {
          return (
            <Device
              sn={element[0]}
              stat={element[1]}
              checked={selectedDevices.has(element[0])}
              mode={mode}
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              key={element[0]}
              index={index}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default function DeviceSelectorModal(props) {
  // (get/set)(found/selected)(adb/fb)
  const gfa = props.gfa;
  const sfa = props.sfa;
  const gff = props.gff;
  const sff = props.sff;
  const selectedDevices = props.selectedDevices;
  const setSelectedDevices = props.setSelectedDevices;

  useEffect(() => {
    api.handle("got-devices-v2", ([mode, data]) => {
      switch (mode) {
        case "adb":
          sfa(deviceParser.parseADB(data));
        case "fb":
          sff(deviceParser.parseFB(data));
      }
    });

    return()=>{
      return () => {
        api.removeIPCListener("got-devices-v2");
      };
    }
  });

  function handleClick() {
    // api.invoke("get-devices", "adb").then((res) => {
    //   const stdout = res.stdout;
    //   sfa(deviceParser.parseADB(從側邊欄選取功b").then((res) => {
    //   const stdout = res.stdout;
    //   sff(deviceParser.parseFB(stdout));
    // });
    api.send("get-devices-v2", "adb");
    api.send("get-devices-v2", "fb");
  }

  return (
    <div
      className="modal fade"
      id="device-selector"
      tabIndex={-1}
      aria-labelledby="ds-title"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="ds-title">
              {props.title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="d-flex">
              <ul
                className="nav nav-underline"
                style={{ marginRight: "auto" }}
                role="tablist"
              >
                <li className="nav-item">
                  <button
                    className="nav-link active"
                    id="ds-adb-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#ds-adb"
                    type="button"
                    role="tab"
                    aria-controls="ds-adb"
                    aria-selected="true"
                  >
                    ADB
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    id="ds-fb-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#ds-fb"
                    type="button"
                    role="tab"
                    aria-controls="ds-fb"
                    aria-selected="true"
                  >
                    Fastboot
                  </button>
                </li>
              </ul>
              <button
                id="refresh-devices"
                className="btn btn-info"
                onClick={handleClick}
              >
                <i className={classNames("bi", "bi-arrow-clockwise")}></i>
              </button>
            </div>
            <div className="tab-content" id="ds-device-type">
              <div
                className="tab-pane fade show active"
                id="ds-adb"
                role="tabpanel"
                aria-labelledby="ds-adb-tab"
                tabIndex={0}
              >
                <DeviceTable
                  mode="adb"
                  foundDevices={gfa}
                  selectedDevices={selectedDevices}
                  setSelectedDevices={setSelectedDevices}
                />
              </div>
              <div
                className="tab-pane fade"
                id="ds-fb"
                role="tabpanel"
                aria-labelledby="ds-fb-tab"
                tabIndex={0}
              >
                <DeviceTable
                  mode="fb"
                  foundDevices={gff}
                  selectedDevices={selectedDevices}
                  setSelectedDevices={setSelectedDevices}
                />
              </div>
            </div>
          </div>
          {/* <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              id="ds-close-btn"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" id="ds-save-btn">
              Save changes
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
