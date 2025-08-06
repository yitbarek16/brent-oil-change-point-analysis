import React from "react";

function ModalDetail({ visible, onClose, content }) {
  if (!visible) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {content}
      </div>
    </div>
  );
}

export default ModalDetail;
