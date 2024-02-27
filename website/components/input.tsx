"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

interface Input {
  value: string | number | FileList;
  onChange: (v: React.ChangeEvent<HTMLInputElement>) => void; //React.Dispatch<React.SetStateAction<string | number | FileList | null>>
  placeholder?: string;
  type?: string;
  accept?: string;
  inputFieldRef?: React.RefObject<HTMLInputElement>;
  name?: string;
  style?: React.CSSProperties;
}

interface TextInput {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

interface AutocompleteInput extends TextInput {
  options: string[];
  allowEmpty?: boolean;
}

interface MultilineInput extends TextInput {
  rows?: number;
  cols?: number;
}

interface PasswordInput extends TextInput {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const Input = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  accept,
  inputFieldRef,
  name,
  style,
}: Input) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (type === "number") {
    //   onChange(parseFloat(event.target.value));
    // } else if (type === "file") {
    //   if (event.target.files) {
    //     onChange(event.target.files);
    //   }
    // } else {
    //   onChange(event.target.value);
    // }
    onChange(event);
  };
  return (
    <div style={style}>
      {type === "file" ? (
        <input
          ref={inputFieldRef}
          style={{
            color: "white",
            borderRadius: 3,
            paddingLeft: 5,
            width: "100%",
            margin: 3,
          }}
          type={type}
          onChange={handleChange}
          placeholder={placeholder}
          security=""
          accept={accept}
          name={name}
        />
      ) : (
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
              : {
                  color: "black",
                  borderRadius: 3,
                  paddingLeft: 5,
                  width: "100%",
                  margin: 3,
                }
          }
          type={type}
          value={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          security=""
          accept={accept}
          name={name}
        />
      )}
    </div>
  );
};

const MultilineInput = ({
  value,
  onChange,
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
        value={value as string}
        onChange={(e) => {
          onChange(e.target.value);
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
  onChange,
  placeholder = "",
  options,
  allowEmpty = false,
}: AutocompleteInput) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(value);
    const filteredSuggestions = options.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(
      allowEmpty ? filteredSuggestions : value === "" ? [] : filteredSuggestions
    );

    setSelectedIndex(-1);
  };
  const handleSuggestionClick = (option: string) => {
    onChange(option);
    setSuggestions([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
      onChange(suggestions[selectedIndex]);
    }
  }, [selectedIndex, suggestions, onChange]);

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
        type={"text"}
        value={value as string}
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

const PasswordInput = ({
  value,
  onChange,
  placeholder = "",
  style,
  isVisible,
  setIsVisible,
}: PasswordInput) => {
  return (
    <div style={style}>
      <input
        style={{
          color: "black",
          borderRadius: 3,
          paddingLeft: 5,
          width: "100%",
          margin: 3,
        }}
        type={isVisible ? "text" : "password"}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div
        style={{
          height: 0,
          justifyContent: "flex-end",
          width: "100%",
          display: "flex",
          transform: "translateY(-24px)",
          paddingRight: 3,
        }}
        onClick={() => {
          setIsVisible(!isVisible);
        }}
      >
        {isVisible ? (
          <FontAwesomeIcon
            icon={faEyeSlash}
            style={{
              fontSize: 18,
              cursor: "pointer",
              color: "black",
              ...style,
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faEye}
            style={{
              fontSize: 18,
              cursor: "pointer",
              color: "black",
              ...style,
            }}
          />
        )}
      </div>
    </div>
  );
};

export { Input, AutocompleteInput, MultilineInput, PasswordInput };
