"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RootState } from "@/lib/store";

interface Section {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  type?: "light" | "dark";
}

interface Container {
  ContainerRef?: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface Card extends Container {
  title: string;
}

interface TouchaleCard extends Card {
  onPress: () => void;
}

interface CardImage {
  description: string;
  image: string;
  date: string;
  username: string;
  lat: number;
  long: number;
  likes: number;
  user_like: boolean;
}

interface ImageCard {
  image: CardImage;
  onImagePress: () => void;
  onLikePress: () => void;
  onMenuPress: () => void;
  style?: React.CSSProperties;
}

const Card = ({ title, children, ContainerRef }: Card) => {
  return (
    <div ref={ContainerRef} style={{ margin: 15, width: 350 }}>
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

const FlexCard = ({ title, children, style, ContainerRef }: Card) => {
  return (
    <div ref={ContainerRef} style={{ margin: 15, ...style }}>
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

const TouchaleCard = ({
  title,
  onPress,
  children,
  ContainerRef,
}: TouchaleCard) => {
  return (
    <div ref={ContainerRef} style={{ margin: 15, width: 350 }}>
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

const ImageCard = ({
  image,
  onImagePress,
  onLikePress,
  onMenuPress,
}: ImageCard) => {
  const { username } = useSelector((state: RootState) => state.user);
  const router = useRouter();
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
              <Image
                src={`https://www.wodkafis.ch/media/${image.image}`}
                alt={`${image.description}`}
                width={340}
                height={285}
                // layout="fixed"
                quality={100}
                // priority
                style={{
                  borderRadius: 10,
                  width: 340,
                  height: 285,
                  objectFit: "cover",
                }}
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
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {username === image.username && (
                    <div onClick={onMenuPress} style={{ marginRight: 10 }}>
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{ fontSize: 24, cursor: "pointer" }}
                      />
                    </div>
                  )}
                  <div
                    onClick={() =>
                      router.push(
                        `/map?lat=${image.lat}&lng=${image.long}&zoom=13`
                      )
                    }
                    style={{ marginRight: 10 }}
                  >
                    <FontAwesomeIcon
                      icon={faMapLocationDot}
                      style={{ fontSize: 24, cursor: "pointer" }}
                    />
                  </div>

                  <h3 style={{ paddingTop: 3, paddingRight: 5 }}>
                    {image.likes}
                  </h3>
                  <div
                    onClick={onLikePress}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      src={image.user_like ? "/like_on.png" : "/like_off.png"}
                      alt={image.user_like ? "/like_on" : "/like_off"}
                      width={20}
                      height={25}
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

const RowContainer = ({
  children,
  style,
  ContainerRef,
  onClick,
}: Container) => {
  return (
    <div
      ref={ContainerRef}
      style={{
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ColumnContainer = ({
  children,
  style,
  ContainerRef,
  onClick,
}: Container) => {
  return (
    <div
      ref={ContainerRef}
      style={{
        flexDirection: "column",
        display: "flex",
        ...style,
      }}
      onClick={onClick}
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
        color: type === "light" ? "white" : type === "dark" ? "white" : "",
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
