import React, { useState, useEffect } from "react";

function ListItem({ text, onRemove }) {
    const [hover, setHover] = useState(false);
  
    return (
      <div className="d-flex flex-column">
        <li
          className="list-group-item d-flex justify-content-between border-0 pb-2"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {text}
          {hover && (
            <button className="btn btn-sm border-0" onClick={onRemove}>
              X
            </button>
          )}
        </li>
        <hr className="hr"></hr>
      </div>
    );
  }

  export default ListItem;