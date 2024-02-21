"use client";
import React, { useEffect, useRef, useState } from "react";
import { client } from "../../../../components/client";
import {
  ColumnContainer,
  FlexCard,
  RowContainer,
  Section,
} from "../../../../components/containers";
import { Text } from "../../../../components/text";
import { useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "../../../../utils/protectedRoute";
import { ErrorMessage, Notification } from "../../../../components/messages";
import {
  Button,
  CloseButton,
  RemoveButton,
} from "../../../../components/buttons";
import { Input, MultilineInput } from "../../../../components/input";
import moment from "moment";
import { create } from "domain";
import Battlepass from "@/app/sponsors/utils";
import { ProgressBar } from "react-bootstrap";

const NewSeason = () => {
  const { router } = useRouter();
  const [season, setSeason] = useState({
    image: null,
    title: "",
    release_date: "",
    maxDonationAmount: "",
    items: [{ price: "", image: null }],
  });
  const seasonImageRef = useRef(null);
  const itemImageRefs = useRef([]);

  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const seasonItemSize = 30;
  const progressBarRef = useRef(null);
  const progressBarWidth = progressBarRef
    ? progressBarRef.current
      ? progressBarRef.current.offsetWidth
      : 300
    : 300;
  const handleSeasonChange = (e) => {
    const { name, value } = e.target;
    setSeason((prevSeason) => ({
      ...prevSeason,
      [name]: value,
    }));
  };

  const handleReleaseDateChange = (e) => {
    const { name, value } = e.target;
    setSeason((prevSeason) => ({
      ...prevSeason,
      [name]: moment(value).format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setSeason((prevSeason) => ({
        ...prevSeason,
        image: reader.result,
      }));
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...season.items];
    updatedItems[index][name] = value;
    setSeason((prevSeason) => ({
      ...prevSeason,
      items: updatedItems,
    }));
  };

  const handleItemChangeImage = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      const updatedItems = [...season.items];
      updatedItems[index].image = imageData;
      setSeason((prevSeason) => ({
        ...prevSeason,
        items: updatedItems,
      }));
    };
    reader.onerror = (error) => {
      console.error("File reading error:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    setSeason((prevSeason) => ({
      ...prevSeason,
      items: [...prevSeason.items, { price: "", image: null }],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...season.items];
    updatedItems.splice(index, 1);
    setSeason((prevSeason) => ({
      ...prevSeason,
      items: updatedItems,
    }));
  };

  const createNewSeason = async () => {
    let isvalid = true;
    season.items.forEach((item, index) => {
      if (item.price === "") {
        setError(`Please enter a price for item ${index + 1}`);
        isvalid = false;
      } else if (item.image === "") {
        setError(`Please select an image for item ${index + 1}`);
        isvalid = false;
      }
    });
    if (season.title === "") {
      setError("Please enter a title");
      isvalid = false;
    } else if (season.release_date === "") {
      setError("Please enter a release date");
      isvalid = false;
    } else if (season.maxDonationAmount === "") {
      setError("Please enter a maximum donation amount for this season");
      isvalid = false;
    } else if (season.image === "") {
      setError("Please select an event Fisch image");
      isvalid = false;
    }

    if (!isvalid) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const body = new FormData();

    body.append(
      "image",
      seasonImageRef.current.files[0],
      `${season.title}_season.png`
    );
    body.append("title", season.title);
    body.append("maxDonationAmount", season.maxDonationAmount);
    body.append("release_date", season.release_date);
    season.items.forEach((item, index) => {
      body.append(`season_items[${index}][price]`, item.price);
      body.append(
        `season_items[${index}][image]`,
        itemImageRefs.current[index].files[0],
        `${season.title}_season_item_${index + 1}.png`
      );
    });

    try {
      const res = await client.post("/admin/new_season", body, config);
      if (res.data.success) {
        setNotification("Season created successfully!");
        setSeason({
          image: null,
          title: "",
          maxDonationAmount: "",
          release_date: "",
          items: [{ price: "", image: null }],
        });
        seasonImageRef.current.value = "";
        itemImageRefs.current.forEach((ref) => {
          ref.value = "";
        });
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(
        "An error occured while creating a new season. Please try again."
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
            <Text text="New Season" fontSize={30} fontWeight="bold" />

            <Input
              value={season.title}
              setValue={handleSeasonChange}
              placeholder="Season Title"
              name="title"
            />

            <Input
              value={season.release_date}
              setValue={handleReleaseDateChange}
              placeholder="Release Date"
              type="datetime-local"
              name="release_date"
            />
            <Input
              value={season.maxDonationAmount}
              setValue={handleSeasonChange}
              placeholder="Max Donation Amount (in Fischflocken)"
              type="number"
              name="maxDonationAmount"
            />
            <RowContainer
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: 10,
              }}
            >
              <label htmlFor="eventImage">Event Fisch Image:</label>
              <Input
                value={season.image}
                setValue={handleImageChange}
                placeholder="Event Image"
                type="file"
                accept="image/*"
                inputFieldRef={seasonImageRef}
                name="image"
              />
            </RowContainer>

            {season.items.map((item, index) => (
              <RowContainer
                key={`item-${index}`}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Text text={`Item ${index + 1}:`} />
                <Input
                  value={item.price}
                  setValue={(e) => handleItemChange(e, index)}
                  placeholder="Item Price"
                  type="number"
                  name="price"
                  style={{ width: 100, marginLeft: 10 }}
                />
                <Input
                  value={item.image}
                  setValue={(e) => handleItemChangeImage(e, index)}
                  placeholder="Item Image"
                  type="file"
                  accept="image/*"
                  inputFieldRef={(ref) => (itemImageRefs.current[index] = ref)}
                  name="image"
                  style={{ width: 280, marginLeft: 10 }}
                />
                <RemoveButton onPress={() => handleRemoveItem(index)} />
              </RowContainer>
            ))}
            <RowContainer style={{ justifyContent: "space-between" }}>
              <Button
                text="Add Item"
                onPress={handleAddItem}
                style={{ width: 150 }}
              />
              <Button
                text="Submit"
                onPress={createNewSeason}
                style={{ width: 150 }}
              />
            </RowContainer>
          </ColumnContainer>
          <ColumnContainer
            style={{ width: "30%", marginTop: 80, alignItems: "center" }}
          >
            {season.title ||
            season.image ||
            season.maxDonationAmount ||
            season.items.some((item) => item.price) ? (
              <FlexCard title="Battle Pass Preview" style={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: 165,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom, #c59c34, #9a690e)",
                      width: "95%",
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid #fff",
                      fontWeight: "bold",
                      margin: 20,
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    <div>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        text={`Season xx`}
                      />
                    </div>
                    <div style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        text={season.title}
                      />
                    </div>
                  </div>
                  <div>
                    <img
                      src={season.image}
                      style={{
                        position: "relative",
                        maxHeight: 60,
                        maxWidth: 80,
                        left: "50%",
                        transform: "translateX(-50%) translateY(-100%)",
                        top: -18,
                        marginBottom: -30,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  {/* Progress Bar */}
                  {season.maxDonationAmount > 0 ? (
                    <div style={{ width: "95%", height: 20 }}>
                      <div
                        ref={progressBarRef}
                        style={{
                          width: "100%",
                          height: 20,
                          background:
                            "linear-gradient(to bottom, #047d7f, #004a3e)",
                          boxShadow: "0 2px 2px #333",
                          borderRadius: 10,
                        }}
                      />
                      {/* Season Items */}
                      <div
                        style={{
                          width: "95%",
                          display: "flex",
                          flexDirection: "row",
                          position: "relative",
                          top: -24.5,
                          marginBottom: 20,
                        }}
                      >
                        {season.items.map(
                          (item, index) =>
                            item.price > 0 && (
                              <div
                                key={index}
                                style={{
                                  width: seasonItemSize,
                                  height: seasonItemSize,
                                  borderRadius: 9,
                                  position: "relative",
                                  left:
                                    (item.price / season.maxDonationAmount) *
                                      progressBarWidth -
                                    seasonItemSize * (index - 1) -
                                    seasonItemSize / 2,
                                  transform: "translateX(-100%)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    position: "absolute",
                                    top: -15,
                                    width: 30,
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    fontSize={8}
                                    text={season.items[index].price}
                                  />
                                  <img
                                    src="/fisch_flakes.png"
                                    style={{
                                      width: 8,
                                      height: 8,
                                      marginLeft: 3,
                                      marginTop: 1.5,
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    width: seasonItemSize,
                                    height: seasonItemSize,
                                    background:
                                      "linear-gradient(to bottom, #047d7f, #004a3e)",
                                    boxShadow: "0 2px 2px #333",
                                    borderRadius: 10,
                                  }}
                                />
                                <img
                                  src={"/Chest_open.png"}
                                  style={{
                                    width: 28,
                                    height: 28,
                                    top: 2,
                                    position: "absolute",
                                  }}
                                />
                                {season.items[index].image ? (
                                  <img
                                    src={season.items[index].image}
                                    style={{
                                      width: 28,
                                      height: 30,
                                      top: 32,
                                      position: "absolute",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : null}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </FlexCard>
            ) : null}
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
};

export default NewSeason;
