import PropTypes from "prop-types";
import React, { useState } from "react";

function InlineEdit({ text, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editText);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditText(e.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <input type="text" value={editText} onChange={handleChange} onBlur={handleSave} />
      ) : (
        <span
          onClick={handleEdit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleEdit();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {text}
        </span>
      )}
    </div>
  );
}

InlineEdit.propTypes = {
  text: PropTypes.string.isRequired, // Text to display
  onSave: PropTypes.func.isRequired // Function to call when saving the edited text
};

export default InlineEdit;
