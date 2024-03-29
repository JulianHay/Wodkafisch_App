"use client";
// import Link from "next/link";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faTrashCan } from "@fortawesome/free-regular-svg-icons";

interface Button {
  onPress: () => void;
  style?: React.CSSProperties;
  innerRef?: React.RefObject<HTMLButtonElement>;
}

interface CustomButton extends Button {
  text: string;
  type?: string;
}

const brightenColor = (color: string, factor = 1.2) => {
  const hexToRgb = (hex: string): number[] => {
    const hexMatch = hex.match(
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
    );
    if (!hexMatch) {
      return [0, 0, 0];
    }
    const [, r, g, b] = hexMatch;

    const rgbArray = [r, g, b].map((component) => parseInt(component, 16));
    return rgbArray;
  };

  const rgbToHex = (...rgb: number[]) =>
    "#" + rgb.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

  const rgbColor = hexToRgb(color);
  const brightenedColor = rgbColor.map((channel) =>
    Math.min(Math.round(channel * factor), 255)
  );
  return rgbToHex(...brightenedColor);
};

const Button = ({
  text,
  onPress,
  type = "primary",
  style,
  innerRef,
}: CustomButton) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const styles = {
    borderRadius: 5,
    padding: 5,
    margin: 5,
    ...style,
  };
  return (
    <button
      ref={innerRef}
      style={
        type === "primary"
          ? {
              backgroundColor: isActive
                ? brightenColor("#20213cff")
                : "#20213cff",
              color: "white",
              ...styles,
            }
          : type === "secondary"
          ? {
              color: isActive ? brightenColor("#161632") : "#161632",
              borderWidth: 1,
              borderColor: isActive ? brightenColor("#161632") : "#161632",
              ...styles,
            }
          : type === "tertiary"
          ? {
              color: isActive ? "#047d79ff" : "grey",
              fontSize: 11,
              textAlign: "left",
              ...styles,
              margin: 3,
              padding: 0,
            }
          : {}
      }
      onClick={onPress}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {text}
    </button>
  );
};

const CloseButton = ({ onPress, style }: Button) => {
  return (
    <div onClick={onPress}>
      <FontAwesomeIcon
        icon={faCircleXmark}
        style={{ fontSize: 24, cursor: "pointer", ...style }}
      />
    </div>
  );
};

const RemoveButton = ({ onPress, style }: Button) => {
  return (
    <div onClick={onPress}>
      <FontAwesomeIcon
        icon={faTrashCan}
        style={{ fontSize: 24, cursor: "pointer", ...style }}
      />
    </div>
  );
};

export { Button, CloseButton, RemoveButton };
