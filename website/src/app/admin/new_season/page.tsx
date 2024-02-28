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
import Image from "next/image";

interface Item {
  price: string;
  image: FileList | undefined;
}

interface Season {
  image: FileList | undefined;
  title: string;
  release_date: string;
  maxDonationAmount: string;
  items: Item[];
}

const NewSeason = () => {
  const router = useRouter();
  const [season, setSeason] = useState<Season>({
    image: undefined,
    title: "",
    release_date: "",
    maxDonationAmount: "",
    items: [{ price: "", image: undefined }],
  });

  const seasonImageRef = useRef(null);
  const itemImageRefs = useRef([]);

  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const seasonItemSize = 30;
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarWidth = progressBarRef.current?.offsetWidth || 300;
  const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      [name]: value,
    }));
  };

  const handleReleaseDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      [name]: moment(value).format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      image: e.target.files || undefined,
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedItems = season ? [...season.items] : [];
    updatedItems[index]["price"] = value;
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      items: updatedItems,
    }));
  };

  const handleItemChangeImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedItems = season ? [...season.items] : [];
    updatedItems[index].image = e.target.files || undefined;
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      items: updatedItems,
    }));
  };

  const handleAddItem = () => {
    setSeason((prevSeason) => {
      const newItem = { price: "", image: undefined };
      const updatedItems = prevSeason
        ? [...prevSeason.items, newItem]
        : [newItem];
      return {
        ...(prevSeason as Season),
        items: updatedItems,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = season ? [...season.items] : [];
    updatedItems.splice(index, 1);
    setSeason((prevSeason) => ({
      ...(prevSeason as Season),
      items: updatedItems,
    }));
  };

  const createNewSeason = async () => {
    let isvalid = true;
    season &&
      season.items.forEach((item, index) => {
        if (item.price === "") {
          setError(`Please enter a price for item ${index + 1}`);
          isvalid = false;
        } else if (!item.image || item.image[0] === undefined) {
          setError(`Please select an image for item ${index + 1}`);
          isvalid = false;
        }
      });
    if (season && season.title === "") {
      setError("Please enter a title");
      isvalid = false;
    } else if (season && season.release_date === "") {
      setError("Please enter a release date");
      isvalid = false;
    } else if (season && season.maxDonationAmount === "") {
      setError("Please enter a maximum donation amount for this season");
      isvalid = false;
    } else if (!season.image || season.image[0] === undefined) {
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
    if (season && season.image) {
      body.append("image", season.image[0], `${season.title}_season.png`);
      body.append("title", season.title);
      body.append("maxDonationAmount", season.maxDonationAmount);
      body.append("release_date", season.release_date);
      season.items.forEach((item, index) => {
        body.append(`season_items[${index}][price]`, item.price);
        body.append(
          `season_items[${index}][image]`,
          season.items[index].image![0],
          `${season.title}_season_item_${index + 1}.png`
        );
      });
    }

    try {
      const res = await client.post("/admin/new_season", body, config);
      if (res.data.success) {
        setNotification("Season created successfully!");
        setSeason({
          image: undefined,
          title: "",
          maxDonationAmount: "",
          release_date: "",
          items: [{ price: "", image: undefined }],
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
              onChange={(e) =>
                handleSeasonChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              placeholder="Season Title"
              name="title"
            />

            <Input
              value={season.release_date}
              onChange={(e) =>
                handleReleaseDateChange(
                  e as React.ChangeEvent<HTMLInputElement>
                )
              }
              placeholder="Release Date"
              type="datetime-local"
              name="release_date"
            />
            <Input
              value={season.maxDonationAmount}
              onChange={(e) =>
                handleSeasonChange(e as React.ChangeEvent<HTMLInputElement>)
              }
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
                value={season.image!}
                onChange={(e) =>
                  handleImageChange(e as React.ChangeEvent<HTMLInputElement>)
                }
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
                  onChange={(e) =>
                    handleItemChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      index
                    )
                  }
                  placeholder="Item Price"
                  type="number"
                  name="price"
                  style={{ width: 100, marginLeft: 10 }}
                />
                <Input
                  value={item.image!}
                  onChange={(e) =>
                    handleItemChangeImage(
                      e as React.ChangeEvent<HTMLInputElement>,
                      index
                    )
                  }
                  placeholder="Item Image"
                  type="file"
                  accept="image/*"
                  // inputFieldRef={(ref) => (itemImageRefs.current[index] = ref)}
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
                    {season.image && (
                      <Image
                        src={URL.createObjectURL(season.image[0])}
                        alt="Season Image"
                        width={80}
                        height={40}
                        style={{
                          position: "relative",
                          width: 80,
                          height: 40,
                          left: "50%",
                          transform: "translateX(-50%) translateY(-100%)",
                          top: -18,
                          marginBottom: -30,
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                  {/* Progress Bar */}
                  {parseFloat(season.maxDonationAmount) > 0 ? (
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
                            parseFloat(item.price) > 0 && (
                              <div
                                key={index}
                                style={{
                                  width: seasonItemSize,
                                  height: seasonItemSize,
                                  borderRadius: 9,
                                  position: "relative",
                                  left:
                                    (parseFloat(item.price) /
                                      parseFloat(season.maxDonationAmount)) *
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
                                  <Image
                                    src="/fisch_flakes.png"
                                    alt="Fisch Flakes"
                                    width={8}
                                    height={8}
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
                                <Image
                                  src={"/chest_open.png"}
                                  alt="Chest Open"
                                  width={28}
                                  height={28}
                                  style={{
                                    width: 28,
                                    height: 28,
                                    top: 2,
                                    position: "absolute",
                                  }}
                                />
                                {season.items[index].image ? (
                                  <Image
                                    src={URL.createObjectURL(
                                      season.items[index].image![0]
                                    )}
                                    alt={`Item ${index + 1}`}
                                    width={28}
                                    height={30}
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
