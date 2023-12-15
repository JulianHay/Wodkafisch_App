import { Camera, CameraType } from "expo-camera";
import { View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CloseButton } from "../custom_botton";

let camera: Camera;

const CameraView = ({
  setVisible,
  imagePickerPressed,
  setPreviewVisible,
  setCapturedImage,
  defaultImage,
}) => {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState("off");

  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };
  return (
    <Camera
      type={cameraType}
      flashMode={flashMode}
      style={{ flex: 1 }}
      ref={(r) => {
        camera = r;
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "transparent",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            flexDirection: "row",
            width: "100%",
            height: 80,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: "10%",
              bottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={__handleFlashMode}
              style={{
                height: 30,
                width: 30,
              }}
            >
              {flashMode === "off" ? (
                <Ionicons name="flash-off" size={24} color="white" />
              ) : (
                <Ionicons name="flash" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              right: "8%",
              bottom: 10,
            }}
          >
            <CloseButton
              onPress={() => {
                setVisible(false);
              }}
            />
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "center",
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={imagePickerPressed}
            style={{
              width: 60,
              height: 60,
              borderRadius: 3,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: "10%",
              zIndex: 1,
            }}
          >
            <Image
              source={
                defaultImage
                  ? { uri: defaultImage }
                  : require("../../assets/fisch.png")
              }
              style={{ width: 58, height: 58, borderRadius: 3 }}
            />
          </TouchableOpacity>

          <View
            style={{
              alignSelf: "center",
              flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={__takePicture}
              style={{
                width: 60,
                height: 60,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 55,
                  height: 55,
                  borderColor: "black",
                  borderRadius: 50,
                  borderWidth: 3,
                }}
              ></View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={__switchCamera}
            style={{
              marginTop: 0,
              height: 30,
              width: 30,
              position: "absolute",
              right: "10%",
            }}
          >
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Camera>
  );
};

export default CameraView;
