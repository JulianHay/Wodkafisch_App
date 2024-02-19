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
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../utils/protectedRoute";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import mapStyle from "../../../utils/mapStyle";
import { Input } from "../../../components/input";
import { ErrorMessage } from "../../../components/messages";

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
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { router } = useRouter();

  const refresh = () => {
    client
      .get("/pictures")
      .then((res) => {
        setPictures(res.data.pictures);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

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
        setDescription(null);
        setImagePosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setSelectedPictureForUpload(null);
        refresh();
      }
    } catch (err) {
      setShowErrorMessage(true);
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
            style={{ width: "90%", height: "90%" }}
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
                    src={`http://127.0.0.1:8000/media/${pictures[selectedPictureIndex].image}`}
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
                        `http://127.0.0.1:8000/media/${pictures[selectedPictureIndex].image}`,
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
                  objectFit: "cover",
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
          {showErrorMessage ? (
            <ErrorMessage
              message="Upload failed, please try again"
              onClose={() => {}}
            />
          ) : null}
        </>
      )}
    </ProtectedRoute>
  );
};

export default Pictures;
