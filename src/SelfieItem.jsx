import React from 'react';

const SelfieItem = ({ selfie, onDelete }) => {
  return (
    <div className="selfie-wrapper">
      <img src={selfie.imageURL} alt="Selfie" />
      <div className="selfie-delete">
        <button onClick={() => onDelete(selfie.key)}>Delete</button>
      </div>
    </div>
  );
};

export default SelfieItem;
