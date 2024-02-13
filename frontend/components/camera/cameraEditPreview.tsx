import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapStyle from "../../assets/mapStyle";
import CustomInput from "../custom_input";
import CustomButton from "../custom_botton";
import client from "../../actions/client";

const EditPreview = ({ visible, setVisible, photo, onSave }: any) => {
  const [description, setDescription] = useState("");
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 48.746417,
    longitude: 9.105801,
  });
  useEffect(() => {
    setDescription(photo.description);
    setMarkerLocation({
      longitude: parseFloat(photo.long),
      latitude: parseFloat(photo.lat),
    });
  }, [photo]);

  const handleMapPress = (event) => {
    setMarkerLocation(event.nativeEvent.coordinate);
  };

  const savePhoto = async (id, description, location) => {
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

      body.append("id", id);
      body.append("lat", location.latitude);
      body.append("long", location.longitude);
      body.append("description", description);
      try {
        const res = await client.post("/edit_picture", body, config);
        if (res.data.success) {
          setVisible(false);
          onSave();
        }
      } catch (err) {
        Alert.alert(err);
      }
    }
  };

  return (
    <Modal visible={visible}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
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
                <Image
                  source={{ uri: "https://wodkafis.ch/media/" + photo.image }}
                  style={{ height: "100%", width: "100%", borderRadius: 10 }}
                  resizeMode="cover"
                />
              </View>
              {/* FileSystem.documentDirectory + photo.image.replace('/', '_') */}

              <MapView
                style={{
                  width: "100%",
                  height: "40%",
                  borderRadius: 10,
                  marginTop: 20,
                }}
                initialRegion={{
                  latitude: markerLocation.latitude,
                  longitude: markerLocation.longitude,
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
                      setVisible(false);
                    }}
                    text="Back"
                    bgColor="black"
                    fgColor="white"
                  />
                </View>
                <View style={{ width: "35%", marginLeft: 40 }}>
                  <CustomButton
                    onPress={() =>
                      savePhoto(photo.id, description, markerLocation)
                    }
                    text="Save"
                    bgColor="black"
                    fgColor="white"
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};
export default EditPreview;
