import React from "react";

interface Text {
  text: string;
  fontWeight?: string;
  fontSize?: number;
  style?: React.CSSProperties;
  id?: string;
}

const Text = ({ text, fontSize, fontWeight, style, id }: Text) => {
  return (
    <p
      style={{
        fontSize: fontSize ? fontSize : 18,
        fontWeight: fontWeight ? fontWeight : "normal",
        ...style,
      }}
      id={id}
    >
      {text}
    </p>
  );
};

const TextBlock = ({ text }: Text) => {
  return (
    <div>
      <p style={{ textAlign: "justify" }}>{text}</p>
    </div>
  );
};

export { TextBlock, Text };
