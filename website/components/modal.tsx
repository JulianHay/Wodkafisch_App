import React from "react";
import "./modal.css";
import { CloseButton } from "./buttons";

interface Modal {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Modal = ({ isVisible, onClose, style, children }: Modal) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {isVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...style,
            }}
          >
            {children}
            <div className="close-button">
              <CloseButton onPress={handleClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
