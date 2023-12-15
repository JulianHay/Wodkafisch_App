import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapStyle from "../../assets/mapStyle";
import CustomInput from "../custom_input";
import CustomButton from "../custom_botton";
import client from "../../actions/client";

const CameraRollPreview = ({
  setVisible,
  photo,
  setPhoto,
  setCameraModalVisible,
  onSave,
}: any) => {
  const [description, setDescription] = useState("");
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 48.746417,
    longitude: 9.105801,
  });

  const handleMapPress = (event) => {
    setMarkerLocation(event.nativeEvent.coordinate);
  };

  const __savePhotoRoll = async (description, location) => {
    if (!description) {
      Alert.alert("please enter a description");
    } else if (!location) {
      Alert.alert("please choose a location");
    } else {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const body = new FormData();
      body.append("image", {
        uri: photo,
        type: "image/jpeg",
        name: description + ".jpeg",
      });
      body.append("lat", location.latitude);
      body.append("long", location.longitude);
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
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          padding: 15,
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <View style={{ height: "30%", width: "100%", borderRadius: 10 }}>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : null}
        </View>

        <MapView
          style={{
            width: "100%",
            height: "40%",
            borderRadius: 10,
            marginTop: 20,
          }}
          initialRegion={{
            latitude: 48.746417,
            longitude: 9.105801,
            latitudeDelta: 50,
            longitudeDelta: 50,
          }}
          onPress={handleMapPress}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
        >
          {markerLocation && (
            <Marker coordinate={markerLocation}>
              <Image
                source={require("../../assets/maps_marker.png")}
                style={{ height: 40, width: 22.7 }}
                resizeMode="contain"
              />
            </Marker>
          )}
        </MapView>

        <View style={{ margin: 20, width: "80%", alignItems: "center" }}>
          <CustomInput
            placeholder="description / location"
            value={description}
            setValue={setDescription}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={{ width: "35%", marginRight: 40 }}>
            <CustomButton
              onPress={() => {
                setPhoto(null);
                setVisible(false);
                setCameraModalVisible(true);
              }}
              text="Back"
              bgColor="black"
              fgColor="white"
            />
          </View>
          <View style={{ width: "35%", marginLeft: 40 }}>
            <CustomButton
              onPress={() => {
                __savePhotoRoll(description, markerLocation);
              }}
              text="Save"
              bgColor="black"
              fgColor="white"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default CameraRollPreview;
