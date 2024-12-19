import React from 'react';

const Modal = ({ onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h3>Modal Title</h3>
      <p>This is a modal with relevant information.</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default Modal;
