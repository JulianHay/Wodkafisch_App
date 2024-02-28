"use client";
import React, { useEffect, useRef, useState } from "react";
import { client } from "../../../components/client";
import {
  ImageCard,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import { Button } from "../../../components/buttons";
import Modal from "../../../components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faSquare,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../../../utils/protectedRoute";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import mapStyle from "../../../utils/mapStyle";
import { Input } from "../../../components/input";
import { ErrorMessage, Notification } from "../../../components/messages";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/lib/store";
import { FixedSizeGrid as Grid } from "react-window";

interface Picture {
  id: number;
  lat: number;
  long: number;
  description: string;
  username: string;
  date: string;
  user_like: boolean;
  likes: number;
  image: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

const Pictures = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPictureDetailModalVisible, setIsPictureDetailModalVisible] =
    useState(false);
  const [isPictureUploadModalVisible, setIsPictureUploadModalVisible] =
    useState(false);
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);
  const ImageUpload = useRef<HTMLInputElement>(null);
  const [selectedPictureForUpload, setSelectedPictureForUpload] =
    useState<FileList>();
  const [description, setDescription] = useState<string>();
  const [imagePosition, setImagePosition] = useState<LatLng>({
    lat: 48.746417,
    lng: 9.105801,
  });
  const [selectedPicture, setSelectedPicture] = useState<Picture>();
  const [isPictureEditModalVisible, setIsPictureEditModalVisible] =
    useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isSignedIn } = useSelector((state: RootState) => state.user);
  const params = useSearchParams();
  const scrollToIndex = params.get("index");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [isSortOptionModalVisible, setIsSortOptionModalVisible] =
    useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const [columnCount, setColumnCount] = useState<number>(3);
  const [rowCount, setRowCount] = useState<number>(50);

  const itemWidth = 380;
  const itemHeight = 404;

  useEffect(() => {
    const getColumnCount = () => {
      setColumnCount(Math.floor(window.innerWidth / itemWidth));
      setRowCount(
        pictures.length === 0
          ? 50
          : Math.ceil(
              pictures.length / Math.floor(window.innerWidth / itemWidth)
            )
      );
    };
    window.addEventListener("resize", () => {
      getColumnCount();
    });
    return () => {
      window.removeEventListener("resize", () => {
        getColumnCount();
      });
    };
  }, []);

  const refresh = () => {
    client
      .get("/pictures")
      .then((res) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });

              const haversine = (
                lat1: number,
                lon1: number,
                lat2: number,
                lon2: number
              ) => {
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

              const addDistance = (data: Picture[]) => {
                const pictureDataWithDistance = data.map((picture) => {
                  const distance = haversine(
                    location.lat,
                    location.lng,
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
              const pictureDataWithDistance = addDistance(res.data.pictures);
              setPictures(pictureDataWithDistance);
              setIsLocationAvailable(true);
            },
            (error) => {
              console.error("Error getting geolocation:", error);
              setPictures(res.data.pictures);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          setPictures(res.data.pictures);
        }
        setColumnCount(Math.floor(window.innerWidth / itemWidth));
        setRowCount(
          Math.ceil(
            res.data.pictures.length / Math.floor(window.innerWidth / itemWidth)
          )
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSignedIn) {
      refresh();
    }
  }, [isSignedIn]);

  useEffect(() => {
    const sortPictures = (type: string) => {
      const key =
        type === "date" ? "id" : type === "likes" ? "likes" : "distance";
      const sortedData = [...pictures].sort(
        (a: any, b: any) => b[key] - a[key]
      );
      setPictures(sortedData);
      setIsSortOptionModalVisible(false);
    };
    sortPictures(sortBy);
  }, [sortBy]);

  useEffect(() => {
    const scrollTo = (index: number) => {
      const columnCount = Math.floor(window.innerWidth / itemWidth);
      const positionToScroll =
        265 + Math.floor(index / columnCount) * itemHeight;
      window.scrollTo({
        top: positionToScroll,
        behavior: "smooth",
      });
    };

    scrollToIndex && !loading && scrollTo(parseInt(scrollToIndex));
  }, [scrollToIndex, loading]);

  const renderPicture = ({ data, columnIndex, rowIndex, style }: any) => {
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

  const pictureLikePressed = (picture_id: number, like: boolean) => {
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
    ImageUpload.current?.click();
    setIsPictureUploadModalVisible(true);
  };

  const uploadPicture = async () => {
    if (!selectedPictureForUpload) {
      setError("Please select a picture to upload");
      return;
    } else if (!description) {
      setError("Please add a description");
      return;
    } else if (!imagePosition) {
      setError("Please select a location");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const body = new FormData();
    body.append("image", selectedPictureForUpload[0], description + ".jpeg");
    body.append("lat", imagePosition.lat.toString());
    body.append("long", imagePosition.lng.toString());
    body.append("description", description);
    try {
      const res = await client.post("/upload_picture", body, config);
      if (res.data.success) {
        setIsPictureUploadModalVisible(false);
        setNotification("Successfully uploaded picture");
        setDescription(undefined);
        setImagePosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setSelectedPictureForUpload(undefined);
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
      id: selectedPicture && selectedPicture.id,
      lat: imagePosition.lat,
      long: imagePosition.lng,
      description: description,
    };
    try {
      const res = await client.post("/edit_picture", body, config);
      if (res.data.success) {
        setIsPictureEditModalVisible(false);
        setNotification("Successfully updated picture");
        setDescription(undefined);
        setImagePosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setSelectedPicture(undefined);
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
            <RowContainer
              style={{ width: "60%", justifyContent: "space-between" }}
            >
              <div style={{ width: 160, height: 50 }} />
              <Button
                text="Upload Picture"
                onPress={() => onUploadPicturePressed()}
                style={{ width: 160, height: 50 }}
              />

              <Button
                innerRef={sortButtonRef}
                text="Sort By ⏷"
                type="tertiary"
                onPress={() => setIsSortOptionModalVisible(true)}
                style={{ width: 160, height: 50, color: "white", fontSize: 16 }}
              />
            </RowContainer>

            <Input
              type="file"
              accept="image/*"
              value={selectedPictureForUpload as FileList}
              inputFieldRef={ImageUpload}
              onChange={(e) => {
                setSelectedPictureForUpload(
                  (e as React.ChangeEvent<HTMLInputElement>).target
                    .files as FileList
                );
              }}
              style={{ display: "none" }}
            />
          </Section>

          <Section>
            <Grid
              columnCount={columnCount}
              columnWidth={itemWidth}
              height={itemHeight * rowCount}
              rowCount={rowCount}
              rowHeight={itemHeight}
              width={itemWidth * columnCount}
              style={{ overflowY: "hidden" }}
              itemData={pictures}
            >
              {renderPicture}
            </Grid>
          </Section>

          {pictures[selectedPictureIndex] && (
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
                    <Image
                      src={`https://www.wodkafis.ch/media/${pictures[selectedPictureIndex].image}`}
                      alt={`${pictures[selectedPictureIndex].description}`}
                      width={500}
                      height={500}
                      priority
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        borderRadius: 10,
                        objectFit: "contain",
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
          )}

          <Modal
            isVisible={
              isPictureUploadModalVisible &&
              selectedPictureForUpload != undefined
            }
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
              {selectedPictureForUpload && (
                <Image
                  src={URL.createObjectURL(selectedPictureForUpload[0])}
                  alt="selected picture"
                  width={300}
                  height={300}
                  priority
                  style={{
                    height: "30vh",
                    width: "30vw",
                    borderRadius: 10,
                    objectFit: "fill",
                  }}
                />
              )}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    height: "30vh",
                    width: "30vw",
                    margin: 10,
                    borderRadius: 10,
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
                        lat: (event && event.latLng && event.latLng.lat()) || 0,
                        lng: (event && event.latLng && event.latLng.lng()) || 0,
                      });
                    }}
                    cursor="move"
                  />
                </GoogleMap>
              ) : null}
              <div style={{ width: "30vw" }}>
                <Input
                  value={description as string}
                  onChange={(e) => {
                    setDescription(e.target.value as string);
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
              isVisible={isPictureEditModalVisible && selectedPicture !== null}
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
                <Image
                  src={`https://www.wodkafis.ch/media/${selectedPicture.image}`}
                  alt="selected picture"
                  width={300}
                  height={300}
                  priority
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
                      borderRadius: 10,
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
                          lat:
                            (event && event.latLng && event.latLng.lat()) || 0,
                          lng:
                            (event && event.latLng && event.latLng.lng()) || 0,
                        });
                      }}
                      cursor="move"
                    />
                  </GoogleMap>
                ) : null}
                <div style={{ width: "30vw" }}>
                  <Input
                    value={description as string}
                    onChange={(e) => {
                      setDescription(e.target.value as string);
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

          {isSortOptionModalVisible && (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              onClick={() => {
                setIsSortOptionModalVisible(false);
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top:
                    (sortButtonRef.current &&
                      sortButtonRef.current?.offsetTop + 40) ||
                    0,
                  left: sortButtonRef.current?.offsetLeft || 0,
                  backgroundColor: "#20213c",
                  borderRadius: 10,
                  zIndex: 1,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <RowContainer
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSortBy("date");
                    setIsSortOptionModalVisible(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={sortBy === "date" ? faSquareCheck : faSquare}
                    style={{ marginRight: 5 }}
                  />
                  <Text text="date" />
                </RowContainer>
                <RowContainer
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSortBy("likes");
                    setIsSortOptionModalVisible(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={sortBy === "likes" ? faSquareCheck : faSquare}
                    style={{ marginRight: 5 }}
                  />
                  <Text text="likes" />
                </RowContainer>
                {isLocationAvailable && (
                  <RowContainer
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSortBy("distance");
                      setIsSortOptionModalVisible(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={sortBy === "distance" ? faSquareCheck : faSquare}
                      style={{ marginRight: 5 }}
                    />
                    <Text text="distance" />
                  </RowContainer>
                )}
              </div>
            </div>
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
