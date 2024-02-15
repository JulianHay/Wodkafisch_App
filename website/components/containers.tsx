"use client";
import Link from "next/link";
import React, { useState } from "react";

interface Section {
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "light" | "dark";
}

interface Container {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface Card extends Container {
  title: string;
}

interface TouchaleCard extends Card {
  onPress: () => void;
}

interface ImageCard {
  image: Object;
  onImagePress: () => void;
  onLikePress: () => void;
  style?: React.CSSProperties;
}

const Card = ({ title, children }: Card) => {
  return (
    <div style={{ margin: 15, width: 350 }}>
      <h2
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
          marginLeft: 5,
          marginBottom: 3,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          backgroundColor: "#20213cff",
          borderRadius: 10,
          padding: 5,
          width: 350,
          height: 350,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const FlexCard = ({ title, children, style }: Card) => {
  return (
    <div style={{ margin: 15, ...style }}>
      <h2
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
          marginLeft: 5,
          marginBottom: 3,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          backgroundColor: "#20213cff",
          borderRadius: 10,
          padding: 5,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const TouchaleCard = ({ title, onPress, children }: TouchaleCard) => {
  return (
    <div style={{ margin: 15, width: 350 }}>
      <h2
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
          marginLeft: 5,
          marginBottom: 3,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          backgroundColor: "#20213cff",
          borderRadius: 10,
          padding: 5,
          width: 350,
          height: 350,
          cursor: "pointer",
        }}
        onClick={onPress}
      >
        {children}
      </div>
    </div>
  );
};

const ImageCard = ({ image, onImagePress, onLikePress }: ImageCard) => {
  return (
    <div style={{ margin: 15, width: 350, height: 374.6 }}>
      {image ? (
        <>
          <h2
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              marginLeft: 5,
              marginBottom: 3,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: 330,
            }}
          >
            {image.description}
          </h2>
          <div
            style={{
              backgroundColor: "#20213cff",
              borderRadius: 10,
              padding: 5,
              width: 350,
              height: 350,
            }}
          >
            <div
              onClick={onImagePress}
              style={{
                cursor: "pointer",
              }}
            >
              <img
                src={`http://127.0.0.1:8000/media/${image.image}`} //{`www.wodkafis.ch/media/${image.image}`}
                alt={`${image.description}`}
                style={{ width: 340, height: 285, borderRadius: 10 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
              <div style={{ width: "60%", alignItems: "flex-start" }}>
                <h3>{image.date}</h3>
                <h3>by {image.username}</h3>
              </div>
              <div
                style={{
                  maxWidth: "40%",
                  display: "flex",
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h3 style={{ paddingTop: 3, paddingRight: 5 }}>
                    {image.likes}
                  </h3>
                  <div
                    onClick={onLikePress}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={image.user_like ? "like_on.png" : "like_off.png"}
                      style={{ width: 20, height: 25 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const RowContainer = ({ children, style }: Container) => {
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ColumnContainer = ({ children, style }: Container) => {
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Section = ({ style, type = "dark", children }: Section) => {
  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        backgroundColor:
          type === "light" ? "#000022ff" : type === "dark" ? "#000022ff" : "",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export {
  Card,
  TouchaleCard,
  FlexCard,
  RowContainer,
  ColumnContainer,
  Section,
  ImageCard,
};
