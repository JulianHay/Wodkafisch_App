"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polygon,
  InfoWindow,
  PolylineF,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";
import { client } from "../../../components/client";
import Countries from "../../../utils/countries";
import ProtectedRoute from "../../../utils/protectedRoute";
import { useRouter } from "next/navigation";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import mapStyle from "../../../utils/mapStyle";
import { Button, CloseButton } from "../../../components/buttons";
import "./style.css";
import { Arrow, calculateRotation } from "./utils";
import { useSelector } from "react-redux";

const MapPage = () => {
  const [loading, setLoading] = useState(true);
  const [pictureData, setPictureData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(-1);
  const [selectedEvent, setSelectedEvent] = useState(-1);
  const [showRoute, setShowRoute] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useSelector((state) => state.user);
  useEffect(() => {
    if (isSignedIn) {
      client
        .get("/map")
        .then((res) => {
          setPictureData(res.data.pictures);
          setEventData(res.data.events.slice(1));
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const countries = eventData
    .map((event) => {
      return Countries.features.find(
        (obj) => obj.properties.name === event.country
      );
    })
    .filter(Boolean);

  const fischRoute = eventData
    .map((event) => ({ lat: event.lat, lng: event.long }))
    .filter((data) => data && data.latitude !== null);
  const RouteMarkerData = fischRoute
    .map((coord, index) =>
      calculateRotation(coord, fischRoute[index - 1], true, 0)
    )
    .slice(1);

  const renderRoute = () => {
    return (
      <>
        <PolylineF
          path={fischRoute}
          options={{
            strokeWeight: 4,
            strokeColor: "#2121b4",
            geodesic: true,
            clickable: false,
          }}
          visible={showRoute}
        />
        {RouteMarkerData.map((markerProps, index) => {
          console.log(markerProps?.rotation);
          return (
            <OverlayViewF
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: markerProps?.coordinate.lat,
                lng: markerProps?.coordinate.lng,
              }}
              key={eventData[index].title}
              clickable={false}
            >
              <Arrow
                color={"#2121b4"}
                size={20}
                index={index + 1}
                rotation={markerProps?.rotation}
              />
            </OverlayViewF>
          );
        })}
      </>
    );
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC9Eyaa-KuEpt1j_94BmihOlLnEU8DgPnk",
  });

  const markers = pictureData.map((picture) => {
    return {
      lat: picture.lat,
      lng: picture.long,
    };
  });

  const polygonOptions = {
    strokeColor: "#0568AE",
    fillColor: "rgba(32, 32, 107, 0.5)",
    fillOpacity: 0.5,
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: true,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  const renderMarkers = () => {
    return markers.map((position, index) => {
      return (
        <Fragment key={`marker-${index}-${position.lat}-${position.lng}`}>
          <Marker
            position={position}
            icon={{
              url: "maps_marker.svg",
            }}
            onClick={() => {
              setSelectedMarker(index);
              setSelectedEvent(-1);
            }}
          />
          {selectedMarker === index && (
            <InfoWindow
              position={position}
              onCloseClick={() => setSelectedMarker(-1)}
            >
              <div>
                <RowContainer
                  style={{ justifyContent: "flex-end", display: "flex" }}
                >
                  <CloseButton
                    onPress={() => {
                      setSelectedMarker(-1);
                    }}
                  />
                </RowContainer>

                <Text text={pictureData[index].description} />
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: -3,
                    paddingRight: -3,
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/media/${pictureData[index].image}`}
                    alt={`${pictureData[index].description}`}
                    style={{
                      width: 340,
                      height: 255,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                </div>
                <RowContainer style={{ justifyContent: "space-between" }}>
                  <Text text={pictureData[index].date} />
                  <Text text={`by ${pictureData[index].username}`} />
                </RowContainer>
              </div>
            </InfoWindow>
          )}
        </Fragment>
      );
    });
  };
  const renderCountries = () => {
    return countries.map((country, index) => {
      const coordinates =
        country?.geometry.type === "MultiPolygon"
          ? country.geometry.coordinates.map((coord) =>
              coord[0].map((c) => ({
                lat: c[1],
                lng: c[0],
              }))
            )
          : country.geometry.coordinates[0].map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }));
      return (
        <Fragment key={`${country?.properties.name}-${index}`}>
          <Polygon
            paths={coordinates}
            options={polygonOptions}
            onClick={() => {
              setSelectedEvent(index);
              setSelectedMarker(-1);
            }}
          />
          {selectedEvent === index && (
            <InfoWindow
              position={{
                lat: eventData[index].lat,
                lng: eventData[index].long,
              }}
              onCloseClick={() => {
                setSelectedEvent(-1);
              }}
            >
              <div>
                <RowContainer
                  style={{ justifyContent: "flex-end", display: "flex" }}
                >
                  <CloseButton onPress={() => setSelectedEvent(-1)} />
                </RowContainer>
                <ColumnContainer
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Text text={eventData[index].title} />
                  <div style={{ margin: 10 }}>
                    <img
                      src={`http://127.0.0.1:8000/media/${eventData[index].image}`}
                      alt={`${pictureData[index].description}`}
                      style={{
                        maxWidth: "150px",
                        maxHeight: "150px",
                        width: "auto",
                        height: "auto",
                        borderRadius: 10,
                      }}
                    />
                  </div>
                  <Text text={pictureData[index].date} />
                </ColumnContainer>
              </div>
            </InfoWindow>
          )}
        </Fragment>
      );
    });
  };

  return (
    <ProtectedRoute router={router}>
      <Section>
        <Text
          fontSize={32}
          fontWeight={"bold"}
          style={{ margin: 30 }}
          text="World Map"
        />
        {isLoaded && !loading ? (
          <div>
            <GoogleMap
              mapContainerStyle={{
                height: "80vh",
                width: "80vw",
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
              {renderMarkers()}
              {renderCountries()}
              {showRoute ? renderRoute() : null}
              <Button
                text={showRoute ? "Hide Route" : "Show Route"}
                onPress={() => setShowRoute(!showRoute)}
                style={{
                  padding: 8,
                  display: "flex",
                  position: "absolute",
                  top: 5,
                  right: 60,
                }}
              />
            </GoogleMap>
          </div>
        ) : (
          <></>
        )}
      </Section>
    </ProtectedRoute>
  );
};

export default MapPage;
