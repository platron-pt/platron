import React from "react";
import cn from "classnames";
export function DevCard({ messages, showLogTestModal }) {
  return (
    <div className={cn("card", "mb-2")}>
      <div className="card-body">
        <h5>{messages.dev.title}</h5>
        <button
          className={cn("btn", "btn-sm", "btn-secondary")}
          onClick={()=>showLogTestModal.set(true)}
        >
          {messages.dev.logTest.title}
        </button>
      </div>
    </div>
  );
}
