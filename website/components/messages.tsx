"use client";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface Message {
  message: string;
  onClose: () => void;
}

interface Notification extends Message {
  backgroundColor?: string;
  textColor?: string;
}

const ErrorMessage = ({ message, onClose }: Message) => {
  return (
    <div>
      <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          backgroundColor: "#f41b38",
          color: "#fff",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 5,
            right: 10,
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

const Notification = ({
  message,
  onClose,
  backgroundColor = "#09c89b",
  textColor = "white",
}: Notification) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: backgroundColor,
        color: "#fff",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 5,
          right: 10,
          color: textColor,
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <p>{message}</p>
    </div>
  );
};
export { ErrorMessage, Notification };
