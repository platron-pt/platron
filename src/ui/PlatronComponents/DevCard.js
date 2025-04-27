import React from "react";
import cn from "classnames";
export function DevCard({ messages }) {
  console.log(messages);
  return (
    <div className={cn("card", "mb-2")}>
      <div className="card-body">
        <h5>{messages.settingsValues.dev.title}</h5>
        <button className={cn("btn", "btn-sm", "btn-secondary")}>
          {messages.settingsValues.dev.logTest}
        </button>
      </div>
    </div>
  );
}
