import React from "react";
import cn from "classnames";
import { Button, Card } from "react-bootstrap";
export function DevCard({ messages, showLogTestModal }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <h5>{messages.dev.title}</h5>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => showLogTestModal.set(true)}
        >
          {messages.dev.logTest.title}
        </Button>
      </Card.Body>
    </Card>
  );
}
