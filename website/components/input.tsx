"use client";
import React, { useEffect, useState } from "react";

interface Input<T> {
  value: T;
  setValue: (v: T) => void;
  placeholder?: string;
  type?: string;
  accept?: string;
  inputFieldRef?: React.RefObject<HTMLInputElement>;
  name?: string;
  style?: React.CSSProperties;
}

interface AutocompleteInput extends Input<T> {
  options: string[];
  allowEmpty?: boolean;
}
interface MultilineInput extends Input<T> {
  rows?: number;
  cols?: number;
}

const Input = ({
  value,
  setValue,
  placeholder = "",
  type = "text",
  accept,
  inputFieldRef,
  name,
  style,
}: Input) => {
  return (
    <div style={style}>
      <input
        ref={inputFieldRef}
        style={
          type === "datetime-local"
            ? {
                color: value === "" ? "#a8afb9" : "black",
                borderRadius: 3,
                paddingLeft: 1,
                width: "100%",
                margin: 3,
              }
            : type === "file"
            ? {
                color: "white",
                borderRadius: 3,
                paddingLeft: 5,
                width: "100%",
                margin: 3,
              }
            : {
                color: "black",
                borderRadius: 3,
                paddingLeft: 5,
                width: "100%",
                margin: 3,
              }
        }
        type={type}
        value={type === "file" ? undefined : value}
        onChange={setValue}
        placeholder={placeholder}
        security=""
        accept={accept}
        name={name}
      />
    </div>
  );
};

const MultilineInput = ({
  value,
  setValue,
  placeholder = "",
  rows = 5,
  cols = 50,
}: MultilineInput) => {
  return (
    <div>
      <textarea
        style={{
          color: "black",
          borderRadius: 3,
          paddingLeft: 5,
          width: "100%",
          margin: 3,
        }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        security=""
        rows={rows}
        cols={cols}
      />
    </div>
  );
};

const AutocompleteInput = ({
  value,
  setValue,
  placeholder = "",
  type = "text",
  options,
  allowEmpty = false,
}: AutocompleteInput) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleInputChange = (event) => {
    const value = event.target.value;
    setValue(value);
    const filteredSuggestions = options.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(
      allowEmpty ? filteredSuggestions : value === "" ? [] : filteredSuggestions
    );

    setSelectedIndex(-1);
  };
  const handleSuggestionClick = (option) => {
    setValue(option);
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      handleSuggestionClick(suggestions[selectedIndex]);
      setSelectedIndex(-1);
    }
  };

  const handleInputFocus = () => {
    setSuggestions(options);
  };

  useEffect(() => {
    if (selectedIndex > -1 && suggestions[selectedIndex]) {
      setValue(suggestions[selectedIndex]);
    }
  }, [selectedIndex, suggestions]);

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
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={allowEmpty ? handleInputFocus : undefined}
        placeholder={placeholder}
        security=""
      />
      {suggestions.length > 1 ? (
        <ul
          style={{
            padding: suggestions.length > 0 ? 5 : 0,
            position: "relative",
            backgroundColor: "#20213cff",
            width: "100%",
            borderRadius: 5,
            margin: 3,
            cursor: "pointer",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              style={{
                backgroundColor:
                  selectedIndex === index ? "#2d2f53" : undefined,
              }}
              key={"suggestion" + index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export { Input, AutocompleteInput, MultilineInput };
