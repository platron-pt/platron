import classNames from "classnames";
import React, { useState } from "react";
import deviceParser from "../devices/deviceParser.js";

function Device(props) {
  const sn = props.sn;
  const stat = props.stat;
  const mode = props.mode;
  const checked = props.checked;
  const selectedDevices = new Set(props.selectedDevices);
  const setSelectedDevices = props.setSelectedDevices;

  function handleChange(event) {
    event.target.checked ? selectedDevices.add(sn) : selectedDevices.delete(sn);
    switch (mode) {
      case "adb":
        window.selectedADBDevices = selectedDevices;
        break;
      case "fb":
        window.selectedFbDevices=selectedDevices;
        console.log(window.selectedFbDevices);
        break;
    }
    setSelectedDevices(selectedDevices);
    
  }
  return (
    <tr>
      <td></td>
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

function DeviceTable(options) {
  const [selectedDevices, setSelectedDevices] = useState(() => new Set());
  const mode = options.mode;
  const foundDevices = options.foundDevices;

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
        {foundDevices.map((i) => {
          return (
            <Device
              sn={i[0]}
              stat={i[1]}
              checked={selectedDevices.has(i[0])}
              mode={mode}
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              key={i[0]}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default function DeviceSelectorModal() {
  // console.log()
  const [foundADBDevices, setFoundADBDevices] = React.useState([]);
  const [foundFBDevices, setFoundFBDevices] = React.useState([]);

  // setFoundFBDevices(["test", "device"]);
  // setFoundADBDevices(["test", "device"]);
  function handleRefreshClick() {
    console.log(foundADBDevices);
    console.log(foundFBDevices);

    api.invoke("get-devices", "adb").then((res) => {
      const stdout = res.stdout;
      setFoundADBDevices(deviceParser.parseADB(stdout));
    });
    api.invoke("get-devices", "fb").then((res) => {
      const stdout = res.stdout;
      setFoundFBDevices(deviceParser.parseFB(stdout));
    });
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
              Modal title
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
                onClick={handleRefreshClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
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
                <DeviceTable mode="adb" foundDevices={foundADBDevices} />
              </div>
              <div
                className="tab-pane fade"
                id="ds-fb"
                role="tabpanel"
                aria-labelledby="ds-fb-tab"
                tabIndex={0}
              >
                <DeviceTable mode="fb" foundDevices={foundFBDevices} />
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
