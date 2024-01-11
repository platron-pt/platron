import React from "react";
import keyPath2obj from "../keypath2obj";
import { oprs } from "./UI";
import { map } from "jquery";

function Title(props) {
  const result = (
    <>
      <h4>{props.title}</h4>
      <h5 className="text-muted">{props.subtitle}</h5>
    </>
  );

  return result;
}

function Content(props) {
  const translation = props.translation;
  const content = props.content;

  console.log(content.map(e=>e))

  return <></>;
}

function OperationBox(props) {
  const lang = props.lang;
  const msg = props.msg;
  const currentOperation = props.currentOperation;
  let result = (
    <h4 id="nothing-selected" className="text-muted">
      {msg.ui.nothingSelected}
    </h4>
  );
  if (currentOperation) {
    const translation = keyPath2obj(currentOperation, lang);
    const content = keyPath2obj(currentOperation, oprs);
    result = (
      <>
        <Title title={translation.title} subtitle={translation.subtitle} />
        <Content translation={translation.content} content={content.content} />
      </>
    );
  }
  return result;
}

export function OperationArea(props) {
  return (
    <div className="operaion-area">
      <p className="do-not-hide"></p>
      <div className="operation-box">
        <OperationBox
          lang={props.lang}
          msg={props.msg}
          currentOperation={props.currentOperation}
        />
      </div>
    </div>
  );
}
