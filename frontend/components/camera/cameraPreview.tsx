import {
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  View,
} from "react-native";
import CustomInput from "../custom_input";
import CustomButton from "../custom_botton";
import { useState } from "react";
import * as Location from "expo-location";
import client from "../../actions/client";

const CameraPreview = ({
  setVisible,
  photo,
  setPhoto,
  setCameraModalVisible,
  onSave,
}: any) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({});

  const __savePhoto = async (description) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == "granted") {
      let location = await Location.getCurrentPositionAsync({});
      if (!description) {
        Alert.alert("please enter a description");
      } else {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const body = new FormData();
        body.append("image", {
          uri: capturedImage.uri,
          type: "image/jpeg",
          name: description + ".jpeg",
        });
        body.append("lat", location.coords.latitude);
        body.append("long", location.coords.longitude);
        body.append("description", description);
        try {
          const res = await client.post("/upload_picture", body, config);
          if (res.data.success) {
            setCameraModalVisible(false);
            setVisible(false);
            onSave();
          }
        } catch (err) {
          Alert.alert(err);
        }
      }
    } else {
      Alert.alert("Permission to access location was denied");
      return;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <View style={{ padding: 20, width: "80%", alignItems: "center" }}>
              <CustomInput
                placeholder="description / location"
                value={description}
                setValue={setDescription}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View style={{ width: "35%", marginRight: 40 }}>
                <CustomButton
                  onPress={() => {
                    setPhoto(null);
                    setVisible(false);
                    setCameraModalVisible(true);
                  }} //retakePicture}
                  text="Re-take"
                  bgColor="black"
                  fgColor="white"
                />
              </View>
              <View style={{ width: "35%", marginLeft: 40 }}>
                <CustomButton
                  onPress={() => {
                    __savePhoto(description);
                  }}
                  text="Save"
                  bgColor="black"
                  fgColor="white"
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
export default CameraPreview;
