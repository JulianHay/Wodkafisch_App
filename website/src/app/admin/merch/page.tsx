"use client";
import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import {
  AutocompleteInput,
  CheckBox,
  Input,
  SelectDropdown,
} from "../../../../components/input";
import moment from "moment";
import { RootState } from "@/lib/store";
import { MerchTable, MerchTableInput } from "../../../../components/merchTable";
import Modal from "../../../../components/modal";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-regular-svg-icons";

interface Merch {
  id: number;
  color: string;
  size: string;
  stock_amount: number;
}

interface SeasonItem {
  item_id: number;
  item_image: string;
  merch: Merch[];
  merch_id: number;
}

interface Season {
  season_title: string;
  season_id: number;
  season_image: string;
  season_items: SeasonItem[];
}

interface MerchData extends Array<Season> {}

interface User {
  first_name: string;
  last_name: string;
}

interface Item {
  id: number;
  merch_id: number;
  image: string;
  available_merch: string[];
}

interface UnlockedItem {
  user: User;
  item: Item;
}

interface SeasonItemMerch extends SeasonItem {
  merch_id: number;
}

interface DistributeMerch {
  item: SeasonItemMerch;
  user: User;
}

const MerchPage = () => {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [value, setValue] = useState<number>();
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const { isAdmin } = useSelector((state: RootState) => state.user);

  const [merchData, setMerchData] = useState<MerchData>();
  const [distributeMerchData, setDistributeMerchData] = useState<
    DistributeMerch[]
  >([]);
  const [unlockedItemData, setUnlockedItemData] = useState<UnlockedItem[]>([]);
  const [isAddMerchModalVisible, setIsAddMerchModalVisible] = useState(false);
  const [merchDataToAdd, setMerchDataToAdd] = useState<Season>();
  const sortSizes = (a: string, b: string) => {
    const order = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
    return order.indexOf(a) - order.indexOf(b);
  };
  const fetchData = async () => {
    client.get("/admin/merch").then((res) => {
      setMerchData(res.data.merch_data);
      setUnlockedItemData(res.data.unlocked_items);
    });
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  useEffect(() => {
    setDistributeMerchData(
      unlockedItemData.map((item) => ({
        item: {
          item_id: item.item.id,
          item_image: item.item.image,
          merch_id: item.item.merch_id,
          merch: [
            {
              id: 0,
              color: "",
              size: "",
              stock_amount: 0,
            },
          ],
        },
        user: item.user,
      }))
    );
  }, [unlockedItemData]);

  const onSave = async (merch: Season) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      merch: merch,
    };
    try {
      const res = await client.post("/admin/merch", body, config);
      if (res.data.success) {
        setIsAddMerchModalVisible(false);
        setMerchDataToAdd(undefined);
        fetchData();
        setNotification(
          `Successfully added\n${merch.season_items
            .map((item, index) =>
              item.merch
                .map((m) =>
                  m.stock_amount !== 0
                    ? `Item${index + 1}: ${m.stock_amount}x${m.color}${m.size}`
                    : null
                )
                .filter(Boolean)
                .join("\n")
            )
            .filter(Boolean)
            .join("\n")} for season ${merch.season_id}`
        );
      } else {
        setError("An error occured while adding merch. Please try again.");
      }
    } catch (err) {
      setError("An error occured while adding merch. Please try again.");
    }
  };

  const handleDistributeMerchChange = (
    item: DistributeMerch,
    index: number
  ) => {
    setDistributeMerchData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], item: item.item, user: item.user };
      return newData;
    });
  };

  const handleDistributeMerchSubmit = async (items: DistributeMerch[]) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      merch: items,
    };
    try {
      const res = await client.post("/admin/distribute_merch", body, config);
      if (res.data.success) {
        setDistributeMerchData([]);
        fetchData();
        setNotification(`Successfully substracted items from stock`);
      } else {
        setError(
          "An error occured while substracting merch. Please try again."
        );
      }
    } catch (err) {
      setError("An error occured while substracting merch. Please try again.");
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
        <RowContainer>
          <ColumnContainer
            style={{ marginTop: 40, alignItems: "center", width: "100%" }}
          >
            {unlockedItemData.length > 0 && (
              <>
                <Text text="Unlocked Items" fontWeight="bold" fontSize={30} />
                <FlexCard
                  title=""
                  innerStyle={{ alignItems: "cenfter", marginBottom: 40 }}
                >
                  {unlockedItemData.map((unlocked_item, index) => (
                    <RowContainer
                      key={index}
                      style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: 5,
                      }}
                    >
                      <Text
                        text={`${unlocked_item.user.first_name} ${unlocked_item.user.last_name} unlocked:`}
                      />
                      <Image
                        src={`https://www.wodkafis.ch${unlocked_item.item.image}`}
                        width={30}
                        height={30}
                        alt={`item${unlocked_item.item.id}`}
                        style={{
                          height: 30,
                          width: 30,
                          objectFit: "contain",
                          margin: 5,
                        }}
                      />

                      {unlocked_item.item.available_merch.length > 0 ? (
                        unlocked_item.item.available_merch[0] === "uni-size" ? (
                          <CheckBox
                            onChange={(isChecked) =>
                              handleDistributeMerchChange(
                                {
                                  item: {
                                    item_id: unlocked_item.item.id,
                                    item_image: unlocked_item.item.image,
                                    merch_id: unlocked_item.item.merch_id,
                                    merch: [
                                      {
                                        id: 0,
                                        color: "",
                                        size: "",
                                        stock_amount: isChecked ? -1 : 0,
                                      },
                                    ],
                                  },
                                  user: unlocked_item.user,
                                },
                                index
                              )
                            }
                            style={{ marginLeft: 5, width: 24, height: 24 }}
                          />
                        ) : (
                          <>
                            <Text text={"Select size:"} />
                            <SelectDropdown
                              options={unlocked_item.item.available_merch
                                .sort((a: string, b: string) => sortSizes(a, b))
                                .map((m) => ({
                                  text: m,
                                  value: m,
                                }))}
                              placeholder="--"
                              onChange={(value) =>
                                handleDistributeMerchChange(
                                  {
                                    item: {
                                      item_id: unlocked_item.item.id,
                                      item_image: unlocked_item.item.image,
                                      merch_id: unlocked_item.item.merch_id,
                                      merch: [
                                        {
                                          id: 0,
                                          color: value.startsWith("#")
                                            ? value
                                            : "",
                                          size: value.startsWith("#")
                                            ? ""
                                            : value,
                                          stock_amount: -1,
                                        },
                                      ],
                                    },
                                    user: unlocked_item.user,
                                  },
                                  index
                                )
                              }
                              style={{ width: 50, height: 40, marginLeft: 5 }}
                            />
                          </>
                        )
                      ) : (
                        <>
                          <Text
                            text="Out of stock"
                            style={{ marginLeft: 5, color: "red" }}
                          />
                          <FontAwesomeIcon
                            icon={faFaceSadCry}
                            style={{ marginLeft: 5, color: "red" }}
                          />
                        </>
                      )}
                    </RowContainer>
                  ))}
                  <ColumnContainer
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <ColumnContainer style={{ width: 100 }}>
                      <Button
                        text="Submit"
                        type="secondary"
                        onPress={() => {
                          handleDistributeMerchSubmit(distributeMerchData);
                        }}
                        style={{
                          color: "white",
                          borderColor: "white",
                        }}
                      />
                    </ColumnContainer>
                  </ColumnContainer>
                </FlexCard>
              </>
            )}
            <Text text="Merch Overview" fontWeight="bold" fontSize={30} />
            <RowContainer>
              {merchData &&
                merchData.map((season) => (
                  <FlexCard
                    key={season.season_title}
                    title={`${season.season_title} Season`}
                    style={{
                      width: "auto",
                      minWidth: 350,
                    }}
                    innerStyle={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <>
                      <MerchTable season={season} />
                      <RowContainer
                        style={{
                          width: "100%",
                          justifyContent: "flex-end",
                          position: "relative",
                          right: 8,
                          transform: "translateY(-100%)",
                          marginBottom: -40,
                        }}
                      >
                        <Button
                          text="Add Merch"
                          type="secondary"
                          onPress={() => {
                            setIsAddMerchModalVisible(true);
                            setMerchDataToAdd(season);
                          }}
                          style={{
                            color: "white",
                            borderColor: "white",
                          }}
                        />
                      </RowContainer>
                    </>
                  </FlexCard>
                ))}
            </RowContainer>
          </ColumnContainer>
        </RowContainer>
      </Section>
      <Modal
        isVisible={isAddMerchModalVisible}
        onClose={() => setIsAddMerchModalVisible(false)}
        style={{
          width: "auto",
        }}
      >
        <MerchTableInput
          season={merchDataToAdd as Season}
          onSave={(season) => onSave(season)}
        />
      </Modal>
    </ProtectedAdminRoute>
  );
};

export default MerchPage;
export type { SeasonItem, Merch, Season };
