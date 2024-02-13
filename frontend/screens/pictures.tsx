import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import client from "../actions/client";
import { CustomText } from "../components/text";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "../components/custom_botton";
import FischLoading from "../components/loading";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import Checkbox from "expo-checkbox";
import {
  fileExists,
  getFromLocal,
  saveToLocal,
  downloadData,
} from "../components/localStorage";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Container } from "../components/custom_container";
import PictureMenuModal from "../components/modals/pictureMenuModal";
import * as FileSystem from "expo-file-system";
import PictureDetailModal from "../components/modals/pictureDetailModal";
import CameraView from "../components/camera/cameraView";
import CameraPreview from "../components/camera/cameraPreview";
import CameraRollPreview from "../components/camera/cameraRollPreview";
import EditPreview from "../components/camera/cameraEditPreview";

const darkmode = true;

const PictureScreen = ({ route, navigation }) => {
  const flatListRef = useRef(null);
  const [selectedContent, setselectedContent] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [pictureData, setPictureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPictureDetailModalVisible, setPictureDetailModalVisible] =
    useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewRollVisible, setPreviewRollVisible] = useState(false);
  const [editPreviewVisible, setEditPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [location, setLocation] = useState({});

  const [initialIndex, setInitialIndex] = useState(0);

  const [username, setUsername] = useState("");
  useEffect(() => {
    if (pictureData.length > 0) {
      const index = pictureData.findIndex(
        (item) => item.id === route.params.id
      );

      setInitialIndex(index);
      flatListRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    } else {
      client.get("/pictures").then(async (res) => {
        const index =
          route.params && route.params.id
            ? res.data["pictures"].findIndex(
                (item) => item.id === route.params.id
              )
            : 0;
        setInitialIndex(index);
        flatListRef.current?.scrollToIndex({
          index: index,
          animated: false,
        });
      });
    }
  }, [navigation, route.params]);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      await getLatestPicture();
      setCameraModalVisible(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const r = 6371; // km
    const p = Math.PI / 180;

    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p))) /
        2;

    const distance = 2 * r * Math.asin(Math.sqrt(a));
    return distance;
  };

  const addDistance = (data) => {
    currentLocation();
    const pictureDataWithDistance = data.map((picture) => {
      const distance = haversine(
        location.latitude,
        location.longitude,
        picture.lat,
        picture.long
      );
      return {
        ...picture,
        distance: distance,
      };
    });
    return pictureDataWithDistance;
  };

  const onRefresh = () => {
    setLoading(true);
    client
      .get("/pictures")
      .then(async (res) => {
        const username = await getFromLocal("username");
        setUsername(username);

        const pictureData = await Promise.all(
          res.data["pictures"].map(async (picture, index) => {
            const filePath = picture.image.replace("/", "_");
            const exists = await fileExists(filePath);
            if (exists) {
              return {
                ...picture,
                url: FileSystem.documentDirectory + filePath,
              };
            } else {
              return {
                ...picture,
                url: "https://wodkafis.ch/media/" + picture.image,
              };
            }
          })
        );
        const pictureDataWithDistance = addDistance(pictureData);
        setPictureData(pictureDataWithDistance);
        setLoading(false);
        pictureData.map(async (picture) => {
          if (picture.url.includes("wodkafis.ch")) {
            await downloadData(picture.url.split("media/")[1]);
          }
        });
      })
      .finally(() => setLoading(false));
  };

  const pictureURLs = pictureData.map((picture) => {
    return { url: picture.url };
  });

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    sortPictures(sortBy);
  }, [loading]);

  const currentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const pictureLikePressed = (picture_id, like) => {
    const itemIndex = pictureData.findIndex((item) => item.id === picture_id);
    if (itemIndex !== -1) {
      const updatedData = [...pictureData];
      updatedData[itemIndex].user_like = like;
      like
        ? (updatedData[itemIndex].likes += 1)
        : (updatedData[itemIndex].likes -= 1);
      setPictureData(updatedData);
    }
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ picture_id, like });
    client.post("/like_picture", body, config);
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -80],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const [isOrderModalVisible, setOrderModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 122, left: 310 });
  const sortButton = useRef(null);
  const [sortBy, setSortBy] = useState("date");
  const measureButton = () => {
    sortButton.current.measureInWindow((x, y, width, height) => {
      setModalPosition({ top: y + height, left: x - 10 });
    });
  };
  const sortPictures = (type: string) => {
    const key =
      type === "date" ? "id" : type === "likes" ? "likes" : "distance";
    const sortedData = [...pictureData].sort((a, b) => b[key] - a[key]);
    setPictureData(sortedData);
    setSortBy(type);
    setOrderModalVisible(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);
  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setPreviewRollVisible(true);
    }
  };

  const getLatestPicture = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      console.error("Permission to access media library was denied");
      return;
    }

    const assets = await MediaLibrary.getAssetsAsync({
      first: 1,
      mediaType: "photo",
      sortBy: ["creationTime"],
    });
    if (assets?.assets.length > 0) {
      setDefaultImage(assets.assets[0].uri);
    } else {
      console.log("No pictures found in the camera roll.");
    }
  };

  const reportContent = (user, picture_id) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ picture_id, user });
    client.post("/report_content", body, config);
  };

  const renderItem = ({ item, index }) => {
    return (
      <Container title={item.description} width={0.9}>
        <TouchableOpacity
          onPress={() => {
            setSelectedPicture(index);
            setPictureDetailModalVisible(true);
          }}
          activeOpacity={1}
        >
          <Image source={{ uri: item.url }} style={styles.image} />
        </TouchableOpacity>

        <View style={styles.imageDescription}>
          <View style={{ width: "60%", alignItems: "flex-start", padding: 10 }}>
            <CustomText color="white" fontSize={18}>
              {item.date}
            </CustomText>
            <CustomText color="white" fontSize={18}>
              by {item.username}
            </CustomText>
          </View>
          <View
            style={{
              flex: 1,
              maxWidth: "40%",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ paddingTop: 3, paddingRight: 5 }}>
                <CustomText color="white">{item.likes}</CustomText>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  zIndex: 1,
                }}
                onPress={() => {
                  pictureLikePressed(item.id, !item.user_like);
                }}
              >
                <Image
                  source={
                    item.user_like
                      ? require("../assets/like_on.png")
                      : require("../assets/like_off.png")
                  }
                  style={{ width: 20, height: 25 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingRight: 10, paddingLeft: 5 }}
                onPress={() => {
                  setselectedContent(item);
                  setMenuModalVisible(true);
                }}
              >
                <FontAwesome5 name="ellipsis-h" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
  };

  return loading ? (
    <FischLoading />
  ) : (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...headerStyle,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "absolute",
          top: 0,
          zIndex: 1,
        }}
      >
        <View style={{ width: "40%", marginTop: 20, marginBottom: 10 }}>
          <CustomButton
            text={"Add Picture"}
            onPress={() => {
              __startCamera();
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: "row",
            position: "absolute",
            right: 0,
          }}
          onPress={() => {
            setOrderModalVisible(!isOrderModalVisible);
            measureButton();
          }}
          ref={sortButton}
        >
          <View style={{ marginTop: 2 }}>
            <CustomText>sort by</CustomText>
          </View>
          <Ionicons
            name="chevron-down"
            size={24}
            color={darkmode ? "white" : "black"}
          />
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={isOrderModalVisible}
          onRequestClose={() => setOrderModalVisible(false)}
        >
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => setOrderModalVisible(false)}
          >
            <View
              style={{
                position: "absolute",
                top: modalPosition.top,
                right: 5,
                backgroundColor: "#161632",
                borderRadius: 3,
              }}
            >
              <TouchableOpacity
                onPress={() => sortPictures("date")}
                style={{
                  padding: 3,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Checkbox
                    value={sortBy === "date"}
                    onValueChange={() => sortPictures("date")}
                    style={{ marginRight: 3 }}
                  />
                  <CustomText>date</CustomText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sortPictures("likes")}
                style={{ padding: 3, paddingLeft: 8, paddingRight: 8 }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Checkbox
                    value={sortBy === "likes"}
                    onValueChange={() => sortPictures("likes")}
                    style={{ marginRight: 3 }}
                  />
                  <CustomText>likes</CustomText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sortPictures("distance")}
                style={{
                  padding: 3,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Checkbox
                    value={sortBy === "distance"}
                    onValueChange={() => sortPictures("distance")}
                    style={{ marginRight: 3 }}
                  />
                  <CustomText>distance</CustomText>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={pictureData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={1}
        getItemLayout={(data, index) => ({
          length: Dimensions.get("window").width * 0.87 + 112,
          offset: (Dimensions.get("window").width * 0.87 + 112) * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              onRefresh();
              setInitialIndex(0);
            }}
          />
        }
        onScroll={handleScroll}
        initialNumToRender={5}
        // initialScrollIndex={initialIndex}
        ListHeaderComponent={() => {
          return <View style={{ height: 80 }} />;
        }}
        onLayout={() => {
          flatListRef.current?.scrollToIndex({
            index: initialIndex,
            animated: false,
          });
        }}
      />

      <Modal visible={isCameraModalVisible}>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          >
            {previewVisible ? (
              <CameraPreview
                setVisible={setPreviewVisible}
                photo={capturedImage}
                setPhoto={setCapturedImage}
                setCameraModalVisible={setCameraModalVisible}
                onSave={onRefresh}
              />
            ) : previewRollVisible ? (
              <CameraRollPreview
                setVisible={setPreviewRollVisible}
                photo={selectedImage}
                setPhoto={setSelectedImage}
                setCameraModalVisible={setCameraModalVisible}
                onSave={onRefresh}
              />
            ) : (
              <CameraView
                setVisible={setCameraModalVisible}
                setPreviewVisible={setPreviewVisible}
                imagePickerPressed={openImagePicker}
                setCapturedImage={setCapturedImage}
                defaultImage={defaultImage}
              />
            )}
          </View>
        </View>
      </Modal>

      {selectedContent ? (
        <EditPreview
          visible={editPreviewVisible}
          setVisible={setEditPreviewVisible}
          photo={selectedContent}
          onSave={async () => {
            await onRefresh();
            const index = pictureData.findIndex(
              (item) => item.id === selectedContent.id
            );
            setInitialIndex(index);
          }}
        />
      ) : null}

      <PictureDetailModal
        visible={isPictureDetailModalVisible}
        urls={pictureURLs}
        index={selectedPicture}
        setVisible={setPictureDetailModalVisible}
        pictureData={pictureData}
        navigation={navigation}
      />

      <PictureMenuModal
        modalVisible={isMenuModalVisible}
        setModalVisible={setMenuModalVisible}
        hidePicture={async () => {
          let filteredPictureIds = await getFromLocal("filteredPictureIds");
          if (Array.isArray(filteredPictureIds)) {
            if (!filteredPictureIds.includes(selectedContent.id)) {
              filteredPictureIds.push(selectedContent.id);
            }
            await saveToLocal("filteredPictureIds", filteredPictureIds);
          } else {
            filteredPictureIds = [selectedContent.id];
            await saveToLocal("filteredPictureIds", [selectedContent.id]);
          }
          onRefresh();
          setMenuModalVisible(false);
        }}
        reportPicture={() => {
          reportContent(selectedContent.username, selectedContent.id);
          Alert.alert("Successfully reported picture");
          setMenuModalVisible(false);
        }}
        reportUser={async () => {
          let filteredUsers = await getFromLocal("filteredUsers");
          if (Array.isArray(filteredUsers)) {
            if (!filteredUsers.includes(selectedContent.username)) {
              filteredUsers.push(selectedContent.username);
            }
            await saveToLocal("filteredUsers", filteredUsers);
          } else {
            filteredUsers = [selectedContent.username];
            await saveToLocal("filteredUsers", [selectedContent.username]);
          }
          onRefresh();
          setMenuModalVisible(false);
          reportContent(selectedContent.username, selectedContent.id);
          Alert.alert("Successfully reported user");
        }}
        edit={
          selectedContent && selectedContent.username === username
            ? () => {
                setEditPreviewVisible(true);
                setMenuModalVisible(false);
              }
            : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: darkmode ? "#000022" : "darkblue",
  },

  image: {
    width: Dimensions.get("window").width * 0.87,
    height: Dimensions.get("window").width * 0.87,
    borderRadius: 10,
    marginTop: -5,
  },
  imageContainer: {
    margin: 10,
  },
  imageDescription: {
    flexDirection: "row",
    flex: 1,
    marginTop: -3,
    marginBottom: -13,
    width: Dimensions.get("window").width * 0.87,
  },
});

export default PictureScreen;
