import React from "react";

function OperationTag({ category, operation, text ,setOperation}) {
  function handleClick() {
    setOperation(`${category}.items.${operation}`);
  }

  return (
    <p
      className="operations user-select-none"
      value={`${category}.items.${operation}`}
      onClick={handleClick}
      key={operation}
    >
      {text}
    </p>
  );
}

export function NavbarButton({ elements, category, lang, setOperation }) {
  return (
    <div className="mb-3 categories-div" key={category}>
      <button
        className="btn btn-primary categories-btn"
        data-bs-toggle="collapse"
        data-bs-target={`#${category}-categories-collapse`}
      >
        {lang.navbar}
      </button>
      <div id={`${category}-categories-collapse`} className="collapse">
        {Object.keys(elements.items).map((e) => {
          return (
            <OperationTag
              category={category}
              text={lang.items[e].title}
              operation={e}
              key={e}
              setOperation={setOperation}
            />
          );
        })}
      </div>
    </div>
  );
}
