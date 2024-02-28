import React from "react";

function InfoModal(props) {
  const title = props.modalTitle;
  const dismiss = props.dismissBtn;
const content=props.modalContent

  return (
    <div
      className="modal fade"
      id="infoModal"
      tabIndex={-1}
      aria-labelledby="infoModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="infoModalLabel">
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
