import React from "react";
import keyPath2obj from "../keypath2obj";
import { oprs } from "./UI";
import { map } from "jquery";
import PlatronComponents from "./PlatronComponents";
import classNames from "classnames";

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
  const [status, setStatus] = React.useState(() => new Map());
  const inputRef = React.useRef(null);

  const translation = props.translation;
  const content = props.content;
  const name = props.name;
  const keyPath = props.keyPath;
  const messages = props.message;
  const noStartButton = props.noStartButton;
  const startBtnTxt = props.startBtnTxt;
  const script = props.script;
  const result = [];
  content.forEach((element, index) => {
    const type = element.type;
    const value = element.value;
    const misc = element.misc;
    switch (type) {
      case "radio":
        result.push (
          <PlatronComponents.radio
            key={keyPath + "-" + value}
            name={name}
            value={value}
            keyPath={keyPath}
            text={translation[index].text}
            status={status}
            setStatus={setStatus}
            inputRef={inputRef}
            misc={misc}
          />
        );
        break;
      case "file":
        result.push (
          <PlatronComponents.file
            key={keyPath + "-file-input"}
            name={name}
            keyPath={keyPath}
            text={messages.ui.fileSelectorBtn}
            defaultText={messages.ui.fileSelectorDefault}
            status={status}
            setStatus={setStatus}
            misc={misc}
          />
        );
        break;
      case "input":
        result.push (
          <PlatronComponents.textInput
            key={keyPath + "-" + value}
            value={value}
            keyPath={keyPath}
            status={status}
            setStatus={setStatus}
            ref={inputRef}
            misc={translation[index].misc}
          />
        );
        break;
    }
  });
  if (!noStartButton) {
    result.push(
      <PlatronComponents.startBtn
        name={name}
        text={startBtnTxt}
        key="sbtn"
        status={status}
        script={script}
        selectedDevices={props.selectedDevices}
        keyPath={keyPath}
        platformInfo={props.platformInfo}
      />
    );
  }
  console.log(status)
  return <>{result}</>;
}
/*-------------------------------------------*/
function OperationBox(props) {
  const lang = props.lang;
  const msg = props.msg;
  const currentOperation = props.currentOperation;

  // when app started
  let result = (
    <h4 id="nothing-selected" className="text-muted">
      {msg.ui.nothingSelected}
    </h4>
  );
  // when item in navbar selected
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
          startBtnTxt={msg.ui.startBtn}
          noStartButton={content.noStartButton}
          script={content.script}
          selectedDevices={props.selectedDevices}
          platformInfo={props.platformInfo}
        />
      </>
    );
  }
  return result;
}

export function OperationArea(props) {
  return (
    <div className={classNames("operation-area", "p-2", "flex-grow-1")}>
      <div className="operation-box">
        <OperationBox
          lang={props.lang}
          msg={props.msg}
          currentOperation={props.currentOperation}
          selectedDevices={props.selectedDevices}
          platformInfo={props.platformInfo}
        />
      </div>
    </div>
  );
}
