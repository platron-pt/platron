import React from "react";
import { Button, Modal } from "react-bootstrap";

function RestartAlertModal({ show, messages }) {
  function handleClose() {
    show.set(false);
  }
  return (
    <Modal show={show.get()} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{messages.alert.infoTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{messages.alert.restartAlert}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {messages.alert.dismiss}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default RestartAlertModal;
