"use client";
import React, { useState } from "react";

interface Input<T> {
  value: T;
  setValue: (v: T) => void;
  placeholder?: string;
  type?: string;
}

const Input = ({ value, setValue, placeholder = "", type = "text" }: Input) => {
  return (
    <div>
      <input
        style={{
          color: "black",
          borderRadius: 3,
          paddingLeft: 5,
          width: "100%",
          margin: 3,
        }}
        type={type}
        value={value}
        onChange={(e) => {
          if (type === "number") {
            setValue(parseFloat(e.target.value));
            return;
          } else {
            setValue(e.target.value);
          }
        }}
        placeholder={placeholder}
        security=""
      />
    </div>
  );
};

export { Input };
