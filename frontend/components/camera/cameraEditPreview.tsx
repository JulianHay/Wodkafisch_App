import { useState } from "react";
import {
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

const EditPreview = ({ visible, setVisible, photo }: any) => {
  const [description, setDescription] = useState(photo.description);
  const [markerLocation, setMarkerLocation] = useState({
    longitude: parseFloat(photo.long),
    latitude: parseFloat(photo.lat),
  });

  const handleMapPress = (event) => {
    setMarkerLocation(event.nativeEvent.coordinate);
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
