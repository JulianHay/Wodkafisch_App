"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text } from "../../../components/text";
import Image from "next/image";

interface ProgressBar {
  percentage: number;
  style: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  startAnimation?: boolean;
  progress: number;
  setProgress: (progress: number) => void;
}

interface seasonData {
  title: string;
  max_donation: number;
  image: string;
  release_date: string;
}

interface sponsorData {
  first_name: string;
  last_name: string;
  username: string;
  sponsor_score: number;
  season_score: number;
  bronze_sponsor: number;
  silver_sponsor: number;
  gold_sponsor: number;
  black_sponsor: number;
  diamond_sponsor: number;
  unlocked_items: number;
  unlocked_items_animation: number;
  season_badges: string[];
}

interface itemData {
  price: number;
  image: string;
}

interface Battlepass {
  seasonData: seasonData[];
  sponsorData: sponsorData[];
  itemData: itemData[];
}

const Battlepass = ({ seasonData, sponsorData, itemData }: Battlepass) => {
  const ProgressBarRef = useRef<HTMLDivElement>(null);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [itemProgesses, setItemProgesses] = useState(
    new Array(itemData.length).fill(0)
  );
  const itemSize = 30;

  const [imagePaths, setImagePaths] = useState(
    itemData.map((data, index) => {
      return sponsorData[0].unlocked_items_animation < index + 1 ||
        sponsorData[0].unlocked_items < index + 1
        ? "/ChestClosed.png"
        : "/chest_open.png";
    })
  );

  const progressAudio = new Audio("bubbles.mp3");
  const unlockAudio = new Audio("hölkynkölkyn.mp3");
  useEffect(() => {
    const updateWidth = () => {
      if (ProgressBarRef.current) {
        const width = ProgressBarRef.current?.offsetWidth;
        setProgressBarWidth(width);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);
  const animatedItems = itemData.map((item, index) => {
    const percentage =
      (sponsorData[0].season_score / seasonData[0].max_donation) * 100;
    const itemStartPercentage =
      (itemData[index].price / seasonData[0].max_donation) * 100 -
      (itemSize / 2 / progressBarWidth) * 100;
    return (
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
          transform: "translateX(-150%)",
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
          <Text fontSize={8} text={itemData[index].price.toString()} />
          <Image
            src="/fisch_flakes.png"
            alt="fisch flakes"
            width={8}
            height={8}
            style={{ width: 8, height: 8, marginLeft: 3, marginTop: 1.5 }}
          />
        </div>

        <ProgressBar
          style={{ width: itemSize, height: itemSize }}
          percentage={
            sponsorData[0].season_score - itemData[index].price < 0
              ? ((((percentage - itemStartPercentage) / 100) *
                  progressBarWidth) /
                  itemSize) *
                100
              : 100
          }
          startAnimation={progressBarValue >= itemStartPercentage}
          progress={itemProgesses[index]}
          setProgress={(newProgress) => {
            setItemProgesses((prevItemProgresses) => {
              const updatedItemProgesses = [...prevItemProgresses];
              updatedItemProgesses[index] = newProgress;
              return updatedItemProgesses;
            });
          }}
          onAnimationStart={() => {
            // unlockAudio.play();

            if (sponsorData[0].unlocked_items_animation >= index) {
              setImagePaths(
                imagePaths.map((image, i) => {
                  return index == i &&
                    sponsorData[0].season_score >= itemData[index].price
                    ? "/chest_open.png"
                    : image;
                })
              );
            }
          }}
        />

        <Image
          src={imagePaths[index]}
          alt={`chest ${index + 1}`}
          width={28}
          height={28}
          style={{ width: 28, height: 28, top: 2, position: "absolute" }}
        />

        <Image
          src={"https://www.wodkafis.ch/media/" + itemData[index].image}
          alt={`item ${index + 1}`}
          width={28}
          height={30}
          style={{
            width: 28,
            height: 30,
            top: 32,
            position: "absolute",
            objectFit: "contain",
          }}
        />
      </div>
    );
  });
  return (
    <div ref={ProgressBarRef} style={{ width: "100%" }}>
      <ProgressBar
        style={{ width: "100%", height: 20 }}
        percentage={
          (sponsorData[0].season_score / seasonData[0].max_donation) * 100
        }
        startAnimation={true}
        onAnimationStart={() => {
          // progressAudio.play();
        }}
        onAnimationEnd={() => {
          // progressAudio.pause();
        }}
        progress={progressBarValue}
        setProgress={setProgressBarValue}
      />
      <Text
        text={sponsorData[0].season_score.toString()}
        style={{
          fontSize: 12,
          transform: "translateY(-19px) translateX(8px)",
          marginBottom: -18,
        }}
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
  percentage,
  onAnimationStart,
  onAnimationEnd,
  startAnimation,
  style,
  progress,
  setProgress,
}: ProgressBar) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const interval = 2;
    const increment = (1 / containerWidth) * 300;
    let timer: NodeJS.Timeout;
    if (startAnimation && progress <= percentage) {
      timer = setInterval(() => {
        const newProgress = progress + increment;
        if (newProgress >= percentage) {
          if (onAnimationEnd) {
            onAnimationEnd();
          }
          clearInterval(timer);
          setProgress(percentage);
        } else {
          setProgress(newProgress);
        }
      }, interval);
    }

    return () => {
      clearInterval(timer);
    };
  }, [progress, startAnimation]);

  useEffect(() => {
    if (onAnimationStart && startAnimation) {
      onAnimationStart();
    }
  }, [startAnimation]);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        backgroundColor: "#292929",
        boxShadow: "0 -1px 1px #c0bfbc inset",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          ...style,
          width: `${progress}%`,
          background: "linear-gradient(to bottom, #047d7f, #004a3e)",
          boxShadow: "0 2px 2px #333",
          borderRadius: 10,
        }}
      ></div>
    </div>
  );
};

export { ProgressBar };

export default Battlepass;
