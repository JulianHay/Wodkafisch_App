"use client";
import React, { useEffect, useRef, useState } from "react";
import { client } from "../../../components/client";
import {
  ImageCard,
  RowContainer,
  Section,
} from "../../../components/containers";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Text } from "../../../components/text";
import { Button } from "../../../components/buttons";
import Modal from "../../../components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../../../utils/protectedRoute";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import mapStyle from "../../../utils/mapStyle";
import { Input } from "../../../components/input";
import { ErrorMessage, Notification } from "../../../components/messages";
import { useSelector } from "react-redux";

interface Item {
  data: Array<Object>;
  columnIndex: number;
  rowIndex: number;
  style?: React.CSSProperties;
}

const Pictures = () => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(50);
  const [columnCount, setColmunCount] = useState(50);
  const [isPictureDetailModalVisible, setIsPictureDetailModalVisible] =
    useState(false);
  const [isPictureUploadModalVisible, setIsPictureUploadModalVisible] =
    useState(false);
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);
  const ImageUpload = useRef(null);
  const [selectedPictureForUpload, setSelectedPictureForUpload] =
    useState(null);
  const [description, setDescription] = useState(null);
  const [imagePosition, setImagePosition] = useState({
    lat: 48.746417,
    lng: 9.105801,
  });
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isPictureEditModalVisible, setIsPictureEditModalVisible] =
    useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isSignedIn } = useSelector((state) => state.user);
  const gridRef = useRef(null);
  const params = useSearchParams();
  const scrollToIndex = params.get("index");

  const refresh = () => {
    client
      .get("/pictures")
      .then((res) => {
        setPictures(res.data.pictures);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSignedIn) {
      refresh();
    }
  }, []);

  useEffect(() => {
    scrollToIndex && !loading && scrollTo(parseInt(scrollToIndex));
  }, [scrollToIndex, loading, columnCount]);

  const scrollTo = (index: number) => {
    const positionToScroll = 265 + Math.floor(index / columnCount) * itemHeight;
    console.log(index, rowCount, positionToScroll);
    window.scrollTo({
      top: positionToScroll,
      behavior: "smooth",
    });
  };

  const itemWidth = 380;
  const itemHeight = 404;

  const calculateColumnCount = (width: number) => {
    const colummCount = Math.floor(width / itemWidth);
    setColmunCount(colummCount);
    return colummCount;
  };

  const calculateRowCount = (width: number) => {
    const rowCount = Math.ceil(pictures.length / Math.floor(width / itemWidth));
    setRowCount(rowCount);
    return rowCount;
  };

  const renderItem = ({ data, columnIndex, rowIndex, style }: Item) => {
    const index = rowIndex * columnCount + columnIndex;
    return (
      <div style={style}>
        <ImageCard
          key={index}
          image={data[index]}
          onImagePress={() => {
            setSelectedPictureIndex(index);
            setIsPictureDetailModalVisible(true);
          }}
          onLikePress={() => {
            pictureLikePressed(data[index].id, !data[index].user_like);
          }}
          onMenuPress={() => {
            setDescription(data[index].description);
            setImagePosition({ lat: data[index].lat, lng: data[index].long });
            setSelectedPicture(data[index]);
            setIsPictureEditModalVisible(true);
          }}
        />
      </div>
    );
  };

  const pictureLikePressed = (picture_id, like) => {
    const itemIndex = pictures.findIndex((item) => item.id === picture_id);
    if (itemIndex !== -1) {
      const updatedData = [...pictures];
      updatedData[itemIndex].user_like = like;
      like
        ? (updatedData[itemIndex].likes += 1)
        : (updatedData[itemIndex].likes -= 1);
      setPictures(updatedData);
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

  const onUploadPicturePressed = () => {
    ImageUpload.current.click();
    setIsPictureUploadModalVisible(true);
  };

  const uploadPicture = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const body = new FormData();
    body.append("image", ImageUpload.current.files[0], description + ".jpeg");
    body.append("lat", imagePosition.lat);
    body.append("long", imagePosition.lng);
    body.append("description", description);
    try {
      const res = await client.post("/upload_picture", body, config);
      if (res.data.success) {
        setIsPictureUploadModalVisible(false);
        setNotification("Successfully uploaded picture");
        setDescription(null);
        setImagePosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setSelectedPictureForUpload(null);
        refresh();
      } else {
        setError(
          "Something went wrong while uploading your picture. Please try again."
        );
      }
    } catch (err) {
      setError(
        "Something went wrong while uploading your picture. Please try again."
      );
    }
  };

  const editPicture = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      id: selectedPicture.id,
      lat: imagePosition.lat,
      long: imagePosition.lng,
      description: description,
    };
    try {
      const res = await client.post("/edit_picture", body, config);
      if (res.data.success) {
        setIsPictureEditModalVisible(false);
        setNotification("Successfully updated picture");
        setDescription(null);
        setImagePosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setSelectedPicture(null);
        refresh();
      } else {
        setError(
          "Something went wrong while updating your picture. Please try again."
        );
      }
    } catch (err) {
      setError(
        "Something went wrong while updating your picture. Please try again."
      );
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC9Eyaa-KuEpt1j_94BmihOlLnEU8DgPnk",
  });

  return (
    <ProtectedRoute router={router}>
      {loading ? null : (
        <>
          <Section>
            <Text
              fontSize={32}
              fontWeight={"bold"}
              style={{ margin: 30 }}
              text="Picture Gallery"
            />
            <Button
              text="Upload Picture"
              onPress={() => onUploadPicturePressed()}
              style={{ width: 160, height: 50 }}
            />

            <input
              type="file"
              id="file"
              ref={ImageUpload}
              onChange={() => {
                const file = ImageUpload.current.files[0];

                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setSelectedPictureForUpload(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: "none" }}
            />
          </Section>

          <div style={{ padding: 10 }}>
            <div
              style={{
                flex: "1 1 auto",
                height: rowCount * itemHeight,
              }}
            >
              <AutoSizer>
                {({ height, width }) => (
                  <div
                    style={{
                      width: width,
                      height: height,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      columnCount={calculateColumnCount(width)}
                      columnWidth={itemWidth}
                      height={itemHeight * rowCount}
                      rowCount={calculateRowCount(width)}
                      rowHeight={itemHeight}
                      width={itemWidth * columnCount}
                      style={{ overflowY: "hidden" }}
                      itemData={pictures}
                      ref={gridRef}
                    >
                      {renderItem}
                    </Grid>
                  </div>
                )}
              </AutoSizer>
            </div>
          </div>

          <Modal
            isVisible={isPictureDetailModalVisible}
            onClose={() => setIsPictureDetailModalVisible(false)}
            style={{ width: "60%", height: "90%" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {selectedPictureIndex > 0 ? (
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  onClick={() => {
                    setSelectedPictureIndex(selectedPictureIndex - 1);
                  }}
                  style={{ fontSize: 24, margin: 10, cursor: "pointer" }}
                />
              ) : null}
              <div
                style={{
                  width: "90%",
                  height: "90%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div style={{ margin: 5 }}>
                  <Text
                    text={`${pictures[selectedPictureIndex].description}`}
                    fontWeight="bold"
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={`https://www.wodkafis.ch/media/${pictures[selectedPictureIndex].image}`}
                    alt={`${pictures[selectedPictureIndex].description}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      borderRadius: 10,
                    }}
                    onClick={() => {
                      window.open(
                        `https://www.wodkafis.ch/media/${pictures[selectedPictureIndex].image}`,
                        "_blank"
                      );
                    }}
                  />
                </div>
                <div style={{ margin: 5 }}>
                  <Text
                    text={`by ${pictures[selectedPictureIndex].username}`}
                    fontWeight="bold"
                  />
                </div>
              </div>
              {selectedPictureIndex + 1 < pictures.length ? (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  onClick={() => {
                    setSelectedPictureIndex(selectedPictureIndex + 1);
                  }}
                  style={{ fontSize: 24, margin: 10, cursor: "pointer" }}
                />
              ) : null}
            </div>
          </Modal>

          <Modal
            isVisible={isPictureUploadModalVisible && selectedPictureForUpload}
            onClose={() => setIsPictureUploadModalVisible(false)}
            style={{ width: "40vw" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={selectedPictureForUpload}
                style={{
                  height: "30vh",
                  width: "30vw",
                  borderRadius: 10,
                  objectFit: "fill",
                }}
              />
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    height: "30vh",
                    width: "30vw",
                    margin: 10,
                  }}
                  zoom={4}
                  onLoad={(map) => {
                    map.panTo({
                      lat: 48.746417,
                      lng: 9.105801,
                    });
                  }}
                  options={{
                    styles: mapStyle,
                  }}
                >
                  <Marker
                    position={imagePosition}
                    icon={{
                      url: "maps_marker.svg",
                    }}
                    draggable={true}
                    onDragEnd={(event) => {
                      setImagePosition({
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng(),
                      });
                    }}
                    cursor="move"
                  />
                </GoogleMap>
              ) : null}
              <div style={{ width: "30vw" }}>
                <Input
                  value={description}
                  setValue={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Description"
                />
              </div>
              <Button
                text="Upload"
                onPress={uploadPicture}
                type="secondary"
                style={{ color: "white", borderColor: "white" }}
              />
            </div>
          </Modal>

          {selectedPicture && (
            <Modal
              isVisible={isPictureEditModalVisible && selectedPicture}
              onClose={() => setIsPictureEditModalVisible(false)}
              style={{ width: "40vw" }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={`https://www.wodkafis.ch/media/${selectedPicture.image}`}
                  style={{
                    height: "30vh",
                    width: "30vw",
                    borderRadius: 10,
                    objectFit: "fill",
                  }}
                />
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{
                      height: "30vh",
                      width: "30vw",
                      margin: 10,
                    }}
                    zoom={4}
                    onLoad={(map) => {
                      map.panTo({
                        lat: selectedPicture.lat,
                        lng: selectedPicture.long,
                      });
                    }}
                    options={{
                      styles: mapStyle,
                    }}
                  >
                    <Marker
                      position={imagePosition}
                      icon={{
                        url: "maps_marker.svg",
                      }}
                      draggable={true}
                      onDragEnd={(event) => {
                        setImagePosition({
                          lat: event.latLng.lat(),
                          lng: event.latLng.lng(),
                        });
                      }}
                      cursor="move"
                    />
                  </GoogleMap>
                ) : null}
                <div style={{ width: "30vw" }}>
                  <Input
                    value={description}
                    setValue={(e) => {
                      setDescription(e.target.value);
                    }}
                    placeholder="Description"
                  />
                </div>
                <Button
                  text="Save"
                  onPress={editPicture}
                  type="secondary"
                  style={{ color: "white", borderColor: "white" }}
                />
              </div>
            </Modal>
          )}
          {error && (
            <ErrorMessage
              message={error}
              onClose={() => {
                setError("");
              }}
            />
          )}
          {notification && (
            <Notification
              message={notification}
              onClose={() => {
                setNotification("");
              }}
            />
          )}
        </>
      )}
    </ProtectedRoute>
  );
};

export default Pictures;
