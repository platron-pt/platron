import React, { PureComponent } from "react";
import keyPath2obj from "../keypath2obj";
import { oprs } from "./UI";
import { map } from "jquery";
import PlatronComponents from "./PlatronComponents";

function Title(props) {
  const result = (
    <>
      <h4>{props.title}</h4>
      <h5 className="text-muted">{props.subtitle}</h5>
    </>
  );

  return result;
}
/*-------------------------------------------*/
function Content(props) {
  const translation = props.translation;
  const content = props.content;
  const name = props.name;
  const keyPath = props.keyPath;
  const messages = props.message;

  const result = content.map((element, index) => {
    const type = element.type;
    const value = element.value;
    const misc = element.misc;
    switch (type) {
      case "radio":
        return (
          <PlatronComponents.radio
            key={keyPath + "-" + value}
            name={name}
            value={value}
            keyPath={keyPath}
            text={translation[index].text}
            misc={misc}
          />
        );
        break;
      case "file":
        return (
          <PlatronComponents.file
            key={keyPath + "-file-input"}
            name={name}
            keyPath={keyPath}
            text={messages.ui.fileSelectorBtn}
            defaultText={messages.ui.fileSelectorDefault}
            misc={misc}
          />
        );
        break;
      case "input":
        return (
          <PlatronComponents.textInput
            key={keyPath + "-" + value}
            value={value}
            keyPath={keyPath}
            misc={translation[index].misc}
          />
        );
        break;
    }
  });
  return <>{result}</>;
}
/*-------------------------------------------*/
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
        <Content
          message={msg}
          translation={translation.content}
          content={content.content}
          name={content.name}
          keyPath={currentOperation}
        />
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
