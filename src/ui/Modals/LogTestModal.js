import React from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";

export function LogTestModal({ show, messages }) {
  const [logGroup, setLogGroup] = React.useState("");
  const [message, setMessage] = React.useState("");


  function handleHide() {
    show.set(false);
  }
  function handleClick() {
    api.send("test-log",[logGroup, message]);
    setMessage("")
  }
  return (
    <Modal show={show.get()} onHide={handleHide}>
      <Modal.Header closeButton>{messages.dev.logTest.title}</Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={messages.dev.logTest.logGroup}
            onChange={(e) => setLogGroup(e.target.value)}
            value={logGroup}
          ></Form.Control>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={messages.dev.logTest.message}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></Form.Control>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClick}>{messages.dev.logTest.send}</Button>
      </Modal.Footer>
    </Modal>
  );
}
