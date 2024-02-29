import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { CloseButton } from "../custom_botton";
import { CustomText } from "../text";
import { FontAwesome } from "@expo/vector-icons";

const PictureDetailModal = ({
  visible,
  urls,
  index,
  setVisible,
  pictureData,
  navigation,
}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        imageUrls={urls}
        index={index}
        enableSwipeDown
        onSwipeDown={() => {
          setVisible(false);
        }}
        renderHeader={(index) => {
          return (
            <>
              <View
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "5%",
                  zIndex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    const coords = {
                      latitude: pictureData[index].lat,
                      longitude: pictureData[index].long,
                    };
                    setVisible(false);
                    navigation.navigate("Map", { coords: coords });
                  }}
                >
                  <FontAwesome name="map-marker" size={30} color={"white"} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: "8%",
                  right: "5%",
                  zIndex: 1,
                }}
              >
                <CloseButton
                  onPress={() => {
                    setVisible(false);
                  }}
                />
              </View>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  left: 0,
                  bottom: 15,
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: 60,
                    padding: 5,
                    backgroundColor: "#161632",
                    width: "50%",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <CustomText fontWeight="bold">
                    {pictureData[index].description}
                  </CustomText>
                </View>
                <View
                  style={{ position: "absolute", bottom: 20, marginBottom: 20 }}
                >
                  <CustomText fontSize={14} fontWeight="bold" color="white">
                    by {pictureData[index].username}
                  </CustomText>
                </View>
              </View>
            </>
          );
        }}
      />
    </Modal>
  );
};
export default PictureDetailModal;
