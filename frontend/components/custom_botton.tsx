import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { CustomText } from "./text";
import { FontAwesome } from "@expo/vector-icons";
const darkmode = true;

const brightenColor = (color, factor = 1.2) => {
  // Convert hex to RGB
  const hexToRgb = (hex) =>
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));

  // Convert RGB to hex
  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

  const rgbColor = hexToRgb(color);
  const brightenedColor = rgbColor.map((channel) =>
    Math.min(Math.round(channel * factor), 255)
  );
  return rgbToHex(...brightenedColor);
};

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
  bgColor,
  fgColor,
  borderColor,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const [loaded] = useFonts({
    ArialRounded: require("../assets/fonts/Arial-Rounded.ttf"),
    ArialRoundedBold: require("../assets/fonts/Arial-RoundedBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Pressable
      onPressIn={() => {
        setIsPressed(!isPressed);
      }}
      onPressOut={() => {
        onPress();
        setIsPressed(!isPressed);
      }}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor
          ? { backgroundColor: bgColor }
          : type === "PRIMARY"
          ? {
              backgroundColor: darkmode
                ? isPressed
                  ? brightenColor("#161632")
                  : "#161632"
                : "darkblue",
            }
          : {},
        borderColor ? { borderColor: borderColor, borderWidth: 2 } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor
            ? { color: fgColor }
            : type === "TERTIARY"
            ? {
                color: darkmode
                  ? isPressed
                    ? brightenColor("#808080", 1.8)
                    : "grey"
                  : "darkblue",
              }
            : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={{
        width: 30,
        height: 30,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <FontAwesome
        name="close"
        size={24}
        color={darkmode ? "white" : "black"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: darkmode ? "#161632" : "darkblue",
  },
  container_TERTIARY: {},
  text: {
    color: "white",
    fontFamily: "ArialRoundedBold",
  },
  text_TERTIARY: {
    color: "grey",
  },
});

export default CustomButton;
export { CloseButton };
