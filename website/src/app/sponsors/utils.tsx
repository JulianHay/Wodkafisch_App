"use client";
import React, { useState, useEffect, useRef } from "react";
import { Text } from "../../../components/text";

interface ProgressBar {
  duration: number;
  percentage: number;
  style: React.CSSProperties;
  onAnimationEnd?: () => void;
  startAnimation?: boolean;
}

const Battlepass = ({ seasonData, sponsorData, itemData }) => {
  const ProgressBarRef = useRef(null);

  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const animatedItemWidths = useRef([]);
  const itemSize = 30;
  // const progressBarWidth = ProgressBarRef.current.offsetWidth;
  // const itemAnimations = itemData.map((data, index) => {
  //   // animatedItemWidths.current[index] = new Animated.Value(0);

  // });
  const [imagePaths, setImagePaths] = useState(
    itemData.map((data, index) => {
      return sponsorData[0].unlocked_items_animation < index + 1 ||
        sponsorData[0].unlocked_items < index + 1
        ? "ChestClosed.png"
        : "chest_open.png";
    })
  );
  const progressAudio = new Audio("bubbles.mp3");
  const unlockAudio = new Audio("hölkynkölkyn.mp3");

  useEffect(() => {
    const updateWidth = () => {
      if (ProgressBarRef.current) {
        const width = ProgressBarRef.current.offsetWidth;
        setProgressBarWidth(width);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);
  // useEffect(() => {

  //   const unlockItem = itemData.map((item, index) =>
  //     index > sponsorData[0].unlocked_items_animation &&
  //     sponsorData[0].unlocked_items < index
  //       ? true
  //       : false
  //   );
  //   const animateItem = Array(itemData.length).fill(true);

  //   window.onload = function () {
  //     progressAudio.play();
  //   };
  //   // Cleanup function
  //   return () => {
  //     progressAudio.pause();
  //     unlockAudio.pause();
  //   };
  // }, []);

  console.log(progressBarWidth);
  const animatedItems = itemData.map((animation, index) => (
    <div
      key={index}
      style={{
        width: itemSize,
        height: itemSize,
        borderRadius: 9,
        position: "relative",
        left:
          (itemData[index].price / seasonData[0].max_donation) *
            progressBarWidth -
          itemSize * (index - 1),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          top: -15,
          width: 30,
          justifyContent: "center",
        }}
      >
        <Text fontSize={8} text={itemData[index].price} />
        <img
          src="fisch_flakes.png"
          style={{ width: 8, height: 8, marginLeft: 3 }}
        />
      </div>

      <ProgressBar
        duration={(50 / progressBarWidth) * itemSize}
        style={{ width: itemSize, height: itemSize }}
        percentage={100}
        startAnimation={true}
      />

      <img
        src={imagePaths[index]}
        style={{ width: 28, height: 28, top: 2, position: "absolute" }}
      />

      <img
        src={"https://wodkafis.ch/media/" + itemData[index].image}
        style={{
          width: 28,
          height: 30,
          top: 32,
          position: "absolute",
          objectFit: "contain",
        }}
      />
    </div>
  ));

  return (
    <div ref={ProgressBarRef} style={{ width: "100%" }}>
      <ProgressBar
        duration={50}
        style={{ width: "100%", height: 20 }}
        percentage={
          (sponsorData[0].season_score / seasonData[0].max_donation) * 100
        }
        startAnimation={true}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
          top: -24.5,
        }}
      >
        {animatedItems}
      </div>
    </div>
  );
};

const ProgressBar = ({
  duration,
  percentage,
  onAnimationEnd,
  startAnimation,
  style,
}: ProgressBar) => {
  const [progress, setProgress] = useState(0);
  const interval = duration;
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startAnimation && progress < percentage) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= percentage) {
            if (onAnimationEnd && typeof onAnimationEnd === "function") {
              onAnimationEnd();
            }
          }
          return newProgress;
        });
      }, interval);
    }

    return () => {
      clearInterval(timer);
    };
  }, [progress, interval, percentage, onAnimationEnd, startAnimation]);

  return (
    <div
      style={{
        ...style,
        backgroundColor: "#292929",
        boxShadow: "0 -1px 1px #c0bfbc inset",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          ...style,
          width: `${progress}%`,
          background: "linear-gradient(to bottom, #047d7f, #004a3e)",
          boxShadow: "0 2px 2px #333",
          borderRadius: 10,
          // transition: `width ${duration}ms linear`,
        }}
      ></div>
    </div>
  );
};

export { ProgressBar };

export default Battlepass;
