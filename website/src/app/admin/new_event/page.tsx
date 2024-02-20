"use client";
import React, { useEffect, useRef, useState } from "react";
import { client } from "../../../../components/client";
import {
  Card,
  ColumnContainer,
  FlexCard,
  RowContainer,
  Section,
} from "../../../../components/containers";
import { Text } from "../../../../components/text";
import { useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "../../../../utils/protectedRoute";
import { ErrorMessage, Notification } from "../../../../components/messages";
import { Button } from "../../../../components/buttons";
import { Input, MultilineInput } from "../../../../components/input";
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
import mapStyle from "../../../../utils/mapStyle";
import moment from "moment";
import { useSelector } from "react-redux";

const NewEvent = () => {
  const { router } = useRouter();
  const [eventID, setEventID] = useState(0);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventWorldmapImage, setEventWorldmapImage] = useState(undefined);
  const [mailGreeting, setMailGreeting] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [mailEventLocation, setMailEventLocation] = useState("");
  const [mailAdditionalText, setMailAdditionalText] = useState("");
  const [mailBye, setMailBye] = useState("");
  const [eventImage, setEventImage] = useState(undefined);
  const [eventCountry, setEventCountry] = useState("");
  const [mailingList, setMailingList] = useState("");
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [markerPosition, setMarkerPosition] = useState({
    lat: 48.746417,
    lng: 9.105801,
  });
  const worldmapImageRef = useRef(null);
  const eventImageRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC9Eyaa-KuEpt1j_94BmihOlLnEU8DgPnk",
  });

  const { isAdmin } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAdmin) {
      client.get("/home").then((res) => {
        setEventID(res.data.upcoming_event[0].id);
      });
    }
  }, []);
  const createNewEvent = async () => {
    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    const mailAdresses = mailingList
      .split(/[,; ]+/)
      .map((email) => email.trim());
    const invalidEmailAdresses = mailingList
      ? mailAdresses.filter((email) => !isValidEmail(email))
      : [];
    setInvalidEmails(invalidEmailAdresses);
    if (!eventTitle) {
      setError("Please enter a title");
      return;
    } else if (!mailGreeting) {
      setError("Please enter a mail greeting");
      return;
    } else if (!mailMessage) {
      setError("Please enter a mail message");
      return;
    } else if (!eventStart) {
      setError("Please enter a start date");
      return;
    } else if (!mailEventLocation) {
      setError("Please enter an event location");
      return;
    } else if (!mailBye) {
      setError("Please enter a goodbye text");
      return;
    } else if (!eventCountry) {
      setError("Please enter a country");
      return;
    } else if (invalidEmailAdresses.length > 0) {
      setError("Please check the provided email addresses");
      return;
    } else if (!eventImage) {
      setError("Please select an event Fisch image");
      return;
    } else if (!eventWorldmapImage) {
      setError("Please select a worldmap image");
      return;
    } else if (
      markerPosition.lat === 48.746417 &&
      markerPosition.lng === 9.105801
    ) {
      setError("Please select a location for the Fisch route on the map");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const body = new FormData();

    body.append("title", eventTitle);
    body.append("start", eventStart);
    body.append("end", eventEnd);
    body.append("country", eventCountry);
    body.append("lat", parseFloat(markerPosition.lat.toFixed(9)).toString());
    body.append("long", parseFloat(markerPosition.lng.toFixed(9)).toString());
    body.append(
      "image",
      eventImageRef.current.files[0],
      `${eventTitle}_fisch.png`
    );
    body.append(
      "worldmap_image",
      worldmapImageRef.current.files[0],
      `${eventTitle}_worldmap.png`
    );
    body.append("hello", mailGreeting);
    body.append("message", mailMessage);
    body.append("location", mailEventLocation);
    body.append("additional_text", mailAdditionalText);
    body.append("bye", mailBye);
    body.append("mailing_list", mailAdresses.join(", "));

    try {
      const res = await client.post("/admin/new_event", body, config);
      if (res.data.success) {
        setNotification("Event created successfully!");
        setEventTitle("");
        setMailGreeting("");
        setMailMessage("");
        setMailAdditionalText("");
        setMailEventLocation("");
        setMailBye("");
        setEventStart("");
        setEventEnd("");
        setEventCountry("");
        setMarkerPosition({
          lat: 48.746417,
          lng: 9.105801,
        });
        setEventImage(undefined);
        setEventWorldmapImage(undefined);
        setMailingList("");
        setInvalidEmails([]);
        eventImageRef.current.value = "";
        worldmapImageRef.current.value = "";
      } else {
        setError(
          "An error occured while creating a new event. Please try again."
        );
      }
    } catch (err) {
      setError(
        "An error occured while creating a new event. Please try again."
      );
    }
  };
  return (
    <ProtectedAdminRoute router={router}>
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
      <Section>
        <RowContainer style={{ alignItems: "flex-start" }}>
          <ColumnContainer style={{ width: "30%" }} />
          <ColumnContainer style={{ width: "40%", marginTop: 40 }}>
            <Text text="New Event" fontSize={30} fontWeight="bold" />
            <Input
              value={eventTitle}
              setValue={(e) => {
                setEventTitle(e.target.value);
              }}
              placeholder="Event Title"
            />

            <Input
              value={mailGreeting}
              setValue={(e) => {
                setMailGreeting(e.target.value);
              }}
              placeholder="Greeting"
            />
            <MultilineInput
              value={mailMessage}
              setValue={setMailMessage}
              placeholder="Message"
            />
            <Input
              value={eventStart}
              setValue={(e) => {
                const date = e.target.value;
                setEventStart(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                setEventEnd(
                  moment(date)
                    .set({ hour: 23, minute: 59, second: 59 })
                    .format("YYYY-MM-DD HH:mm:ss")
                );
              }}
              placeholder="Start Date"
              type="datetime-local"
            />
            <Input
              value={mailEventLocation}
              setValue={(e) => {
                setMailEventLocation(e.target.value);
              }}
              placeholder="Event Location"
            />
            <MultilineInput
              value={mailAdditionalText}
              setValue={setMailAdditionalText}
              placeholder="Additional Text"
              rows={1}
            />
            <Input
              value={mailBye}
              setValue={(e) => {
                setMailBye(e.target.value);
              }}
              placeholder="Goodbye Text"
            />
            <Input
              value={eventCountry}
              setValue={(e) => {
                setEventCountry(e.target.value);
              }}
              placeholder="Country"
            />
            <MultilineInput
              value={mailingList}
              setValue={setMailingList}
              placeholder="Mailing List, separated by commas, semicolons, or spaces"
              rows={1}
            />
            {invalidEmails.length > 0 && mailingList && (
              <div style={{ color: "red" }}>
                <p>please check the following email adresses:</p>
                <ul>
                  {invalidEmails.map((email, index) => (
                    <li key={email + index}>{email}</li>
                  ))}
                </ul>
              </div>
            )}
            <RowContainer
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: 10,
              }}
            >
              <label htmlFor="worldmapImage">World Map Image:</label>
              <Input
                value={eventWorldmapImage}
                setValue={(e) => {
                  const file = worldmapImageRef.current.files[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setEventWorldmapImage(reader.result);
                    };
                    reader.onerror = (error) => {
                      console.error("File reading error:", error);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                placeholder="Worldmap Image"
                type="file"
                accept="image/*"
                inputFieldRef={worldmapImageRef}
              />
            </RowContainer>
            <RowContainer
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: 10,
              }}
            >
              <label htmlFor="eventImage">Event Fisch Image:</label>
              <Input
                value={eventImage}
                setValue={(e) => {
                  const file = eventImageRef.current.files[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setEventImage(reader.result);
                    };
                    reader.onerror = (error) => {
                      console.error("File reading error:", error);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                placeholder="Event Image"
                type="file"
                accept="image/*"
                inputFieldRef={eventImageRef}
              />
            </RowContainer>
            {isLoaded ? (
              <RowContainer style={{ alignItems: "center" }}>
                <GoogleMap
                  mapContainerStyle={{
                    height: "30vh",
                    width: "100%",
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
                    position={markerPosition}
                    icon={{
                      url: "/maps_marker.svg",
                    }}
                    draggable={true}
                    onDragEnd={(event) => {
                      setMarkerPosition({
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng(),
                      });
                    }}
                    cursor="move"
                  />
                </GoogleMap>
              </RowContainer>
            ) : null}
            <Button text="Submit" onPress={createNewEvent} />
          </ColumnContainer>

          <ColumnContainer style={{ width: "30%", padding: 80 }}>
            {eventTitle ||
            mailGreeting ||
            mailMessage ||
            eventWorldmapImage ||
            eventImage ||
            eventStart ||
            mailEventLocation ||
            mailBye ||
            mailAdditionalText ? (
              <>
                <Text text="Mail Preview" fontSize={20} fontWeight="bold" />
                <ColumnContainer
                  style={{
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  {eventWorldmapImage ? (
                    <img
                      src={eventWorldmapImage}
                      style={{ width: "90%", height: 80, borderRadius: 10 }}
                    />
                  ) : null}
                  <Text
                    text={`Etappe ${eventID}:`}
                    fontSize={10}
                    style={{ color: "black" }}
                    fontWeight="bold"
                  />
                  <Text
                    text={eventTitle}
                    fontSize={10}
                    style={{ color: "black" }}
                    fontWeight="bold"
                  />
                  <ColumnContainer
                    style={{
                      alignItems: "flex-start",
                      backgroundColor: "white",
                      borderRadius: 10,
                      padding: 10,
                      width: "100%",
                    }}
                  >
                    {mailGreeting ? (
                      <Text
                        text={`${mailGreeting},`}
                        fontSize={8}
                        style={{ color: "black", marginBottom: 5 }}
                      />
                    ) : null}
                    {mailMessage.split("\n").map((line, index) => (
                      <Text
                        text={line}
                        fontSize={8}
                        style={{ color: "black" }}
                      />
                    ))}
                    {eventStart ? (
                      <Text
                        text={`Wann? ${moment(eventStart).format(
                          "DD.MM.YYYY HH:mm"
                        )}`}
                        fontSize={8}
                        style={{
                          color: "black",
                          marginBottom: 1,
                          marginTop: 5,
                        }}
                      />
                    ) : null}
                    {mailEventLocation ? (
                      <Text
                        text={`Wo? ${mailEventLocation}`}
                        fontSize={8}
                        style={{ color: "black", marginBottom: 5 }}
                      />
                    ) : null}
                    {mailAdditionalText.split("\n").map((line, index) => (
                      <Text
                        text={line}
                        fontSize={8}
                        style={{ color: "black" }}
                      />
                    ))}
                    {mailBye ? (
                      <>
                        <Text
                          text={`${mailBye},`}
                          fontSize={8}
                          style={{
                            color: "black",
                            marginBottom: 1,
                            marginTop: 5,
                          }}
                        />
                        <Text
                          text={"Fisch"}
                          fontSize={8}
                          style={{ color: "black" }}
                        />
                      </>
                    ) : null}
                  </ColumnContainer>
                  {eventImage ? (
                    <img src={eventImage} style={{ width: "40%" }} />
                  ) : null}
                </ColumnContainer>
              </>
            ) : null}
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
};

export default NewEvent;
