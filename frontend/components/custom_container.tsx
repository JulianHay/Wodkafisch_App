import { LinearGradient } from "expo-linear-gradient";
import React, { Children } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CustomText } from "./text";

const darkmode = true;

const CustomBox = (props) => {
  const {
    onPress,
    width,
    bgColor,
    borderColor,
    borderRadius,
    borderWidth,
    colors,
    children,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.box,
        width ? { width: Dimensions.get("window").width * width } : {},
        bgColor ? { backgroundColor: bgColor } : {},
        borderColor ? { borderColor: borderColor } : {},
        borderRadius ? { borderRadius: borderRadius } : {},
        borderWidth ? { borderWidth: borderWidth } : {},
        colors ? { padding: 0 } : {},
      ]}
    >
      {colors ? (
        <LinearGradient
          colors={colors}
          style={{
            borderRadius: 7,
            width: "100%",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const TouchableContainer = (props) => {
  const {
    onPress,
    title,
    width,
    bgColor,
    borderColor,
    borderRadius,
    borderWidth,
    colors,
    activeOpacity,
    children,
  } = props;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
      <View style={styles.text}>
        <CustomText color={darkmode ? "white" : "black"} fontWeight="bold">
          {title}
        </CustomText>
      </View>

      <View
        style={[
          styles.box,
          width ? { width: Dimensions.get("window").width * width } : {},
          bgColor ? { backgroundColor: bgColor } : {},
          borderColor ? { borderColor: borderColor } : {},
          borderRadius ? { borderRadius: borderRadius } : {},
          borderWidth ? { borderWidth: borderWidth } : {},
          colors ? { padding: 0 } : {},
          { marginBottom: 20 },
        ]}
      >
        {colors ? (
          <LinearGradient
            colors={colors}
            style={{
              borderRadius: 7,
              width: "100%",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {children}
          </LinearGradient>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};

const Container = (props) => {
  const {
    title,
    width,
    bgColor,
    borderColor,
    borderRadius,
    borderWidth,
    colors,
    children,
  } = props;
  return (
    <View>
      <View style={styles.text}>
        <CustomText color={darkmode ? "white" : "black"} fontWeight="bold">
          {title}
        </CustomText>
      </View>

      <View
        style={[
          styles.box,
          width ? { width: Dimensions.get("window").width * width } : {},
          bgColor ? { backgroundColor: bgColor } : {},
          borderColor ? { borderColor: borderColor } : {},
          borderRadius ? { borderRadius: borderRadius } : {},
          borderWidth ? { borderWidth: borderWidth } : {},
          colors ? { padding: 0 } : {},
          { marginBottom: 20 },
        ]}
      >
        {colors ? (
          <LinearGradient
            colors={colors}
            style={{
              borderRadius: 7,
              width: "100%",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {children}
          </LinearGradient>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: darkmode ? "#161632" : "darkblue",
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginLeft: 10,
    paddingLeft: 5,
    marginBottom: -5,
    width: Dimensions.get("window").width * 0.8,
    color: darkmode ? "white" : "black",
  },
});

export { CustomBox, Container, TouchableContainer };
