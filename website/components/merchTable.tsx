import React from "react";
import { Merch, Season, SeasonItem } from "@/app/admin/merch/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { ColumnContainer, RowContainer } from "./containers";
import { Button } from "./buttons";
import { Input } from "./input";
import Modal from "./modal";
import { Text } from "./text";

interface Props {
  season: Season;
  onSave?: (season: Season) => void;
}

const MerchTable: React.FC<Props> = ({ season }) => {
  const seasonItems = season.season_items;
  const sortSizes = (a: string, b: string) => {
    const order = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
    return order.indexOf(a) - order.indexOf(b);
  };

  return (
    <>
      <table>
        <tbody>
          {seasonItems.map((item) => {
            let min = seasonItems[0].merch.length;
            let max = seasonItems[0].merch.length;

            seasonItems.forEach((item) => {
              const merchLength = item.merch.length;
              if (merchLength < min) {
                min = merchLength;
              }
              if (merchLength > max) {
                max = merchLength;
              }
            });
            return (
              <tr key={item.item_image}>
                <td style={{ borderRightColor: "white", borderRightWidth: 1 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      margin: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={`https://www.wodkafis.ch${item.item_image}`}
                      alt={item.item_image}
                      width={40}
                      height={40}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </td>
                {item.merch
                  .sort((a: Merch, b: Merch) => sortSizes(a.size, b.size))
                  .map((merch, index) => (
                    <td key={merch.id}>
                      <RowContainer
                        style={{ alignItems: "center", justifyContent: "left" }}
                      >
                        <div
                          style={{
                            width: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "right",
                          }}
                        >
                          {merch.stock_amount}
                        </div>
                        {(merch.size || merch.color) && (
                          <FontAwesomeIcon
                            icon={faTimes}
                            fontSize={16}
                            style={{ padding: 5 }}
                          />
                        )}
                        {merch.size}
                        {merch.color && (
                          <div
                            style={{
                              backgroundColor: merch.color,
                              height: 15,
                              width: 20,
                              borderColor: "#999999",
                              borderWidth: 0.1,
                              borderRadius: 2,
                            }}
                          />
                        )}
                      </RowContainer>
                    </td>
                  ))}
                {max === 0 && (
                  <td>
                    <div style={{ width: 300 }}></div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const MerchTableInput: React.FC<Props> = ({ season, onSave }) => {
  const [isAddEntryModalVisible, setIsAddEntryModalVisible] =
    React.useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(-1);
  const [colorInput, setColorInput] = React.useState("");
  const [sizeInput, setSizeInput] = React.useState("");
  const [isColor, setIsColor] = React.useState(false);
  const [isSize, setIsSize] = React.useState(false);
  const sortSizes = (a: string, b: string) => {
    const order = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
    return order.indexOf(a) - order.indexOf(b);
  };
  const seasonItems = season.season_items;
  const [seasonMerch, setSeasonMerch] = React.useState<SeasonItem[]>(
    seasonItems.map((item) => ({
      ...item,
      merch: item.merch.map((merch) => ({
        ...merch,
        stock_amount: 0,
      })),
    }))
  );

  const handleStockAmountChange = (
    newValue: number,
    itemIndex: number,
    merchIndex: number
  ) => {
    const updatedSeasonMerch = [...seasonMerch];
    updatedSeasonMerch[itemIndex].merch[merchIndex].stock_amount = newValue;
    setSeasonMerch(updatedSeasonMerch);
  };

  const handleAddEntry = (
    itemIndex: number,
    isSize: boolean,
    isColor: boolean
  ) => {
    setSelectedItemIndex(itemIndex);
    setIsSize(isSize);
    setIsColor(isColor);
    setSizeInput("");
    setColorInput("");
    setIsAddEntryModalVisible(true);
  };
  const handleAddItemProp = () => {
    if (selectedItemIndex !== -1) {
      const sizesArray = sizeInput
        .split(",")
        .map((size: string) => size.trim().toUpperCase());
      const colorsArray = colorInput
        .split(",")
        .map((color: string) => color.trim());

      const newMerchItems: Merch[] = [];

      if (sizesArray.length === 1 && colorsArray.length === 1) {
        const newItem: Merch = {
          id: seasonMerch[selectedItemIndex].merch.length + 1,
          color: colorsArray[0],
          size: sizesArray[0],
          stock_amount: 0,
        };
        newMerchItems.push(newItem);
      } else {
        for (
          let i = 0;
          i < Math.max(sizesArray.length, colorsArray.length);
          i++
        ) {
          const newItem: Merch = {
            id: seasonMerch[selectedItemIndex].merch.length + 1,
            color: colorsArray[i % colorsArray.length],
            size: sizesArray[i % sizesArray.length],
            stock_amount: 0,
          };
          newMerchItems.push(newItem);
        }
      }

      const updatedSeasonMerch = [...seasonMerch];
      updatedSeasonMerch[selectedItemIndex].merch.push(...newMerchItems);
      setSeasonMerch(updatedSeasonMerch);
      setIsAddEntryModalVisible(false);
      setIsColor(false);
      setIsSize(false);
    }
  };

  return (
    <>
      <Text
        text="Values will be added to the existing stock."
        style={{ margin: 10 }}
      />
      <RowContainer style={{ flexWrap: "nowrap" }}>
        <ColumnContainer>
          <table>
            <tbody>
              {seasonMerch.map((item, item_index) => {
                let min = seasonItems[0].merch.length;
                let max = seasonItems[0].merch.length;

                seasonItems.forEach((item) => {
                  const merchLength = item.merch.length;
                  if (merchLength < min) {
                    min = merchLength;
                  }
                  if (merchLength > max) {
                    max = merchLength;
                  }
                });
                return (
                  <tr key={item.item_image}>
                    <td
                      style={{ borderRightColor: "white", borderRightWidth: 1 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          margin: 5,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={`https://www.wodkafis.ch${item.item_image}`}
                          alt={item.item_image}
                          width={40}
                          height={40}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </td>
                    {item.merch
                      .sort((a: Merch, b: Merch) => sortSizes(a.size, b.size))
                      .map((merch, merch_index) => (
                        <td key={merch.id}>
                          <RowContainer
                            style={{
                              alignItems: "center",
                              justifyContent: "left",
                            }}
                          >
                            <Input
                              value={
                                seasonMerch[item_index].merch[merch_index]
                                  .stock_amount
                              }
                              onChange={(e) => {
                                handleStockAmountChange(
                                  parseInt(e.target.value),
                                  item_index,
                                  merch_index
                                );
                              }}
                              placeholder={merch.stock_amount.toString()}
                              type="number"
                              style={{ width: 50, marginLeft: 10 }}
                            />
                            {(merch.size || merch.color) && (
                              <FontAwesomeIcon
                                icon={faTimes}
                                fontSize={16}
                                style={{ padding: 5 }}
                              />
                            )}
                            {merch.size}
                            {merch.color && (
                              <div
                                style={{
                                  backgroundColor: merch.color,
                                  height: 15,
                                  width: 20,
                                  borderColor: "#999999",
                                  borderWidth: 0.1,
                                  borderRadius: 2,
                                }}
                              />
                            )}
                          </RowContainer>
                        </td>
                      ))}
                    {max === 0 && (
                      <td>
                        <div style={{ width: 300 }}></div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ColumnContainer>
        <ColumnContainer>
          <table>
            <tbody>
              {seasonMerch.map((item, item_index) => (
                <tr key={item.item_id}>
                  <ColumnContainer
                    style={{
                      height: 52,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      text="Add Items"
                      onPress={() =>
                        handleAddEntry(
                          item_index,
                          item.merch[0] ? item.merch[0].size !== "" : false,
                          item.merch[0] ? item.merch[0].color !== "" : false
                        )
                      }
                      style={{
                        color: "white",
                        borderColor: "white",
                        borderWidth: 1,
                      }}
                    />
                  </ColumnContainer>
                </tr>
              ))}
            </tbody>
          </table>
        </ColumnContainer>
      </RowContainer>
      <Button
        text="Save"
        onPress={() => {
          onSave!({
            season_title: season.season_title,
            season_id: season.season_id,
            season_image: season.season_image,
            season_items: seasonMerch,
          });
        }}
        style={{
          color: "white",
          borderColor: "white",
          borderWidth: 1,
        }}
      />

      <Modal
        isVisible={isAddEntryModalVisible}
        onClose={() => {
          setIsAddEntryModalVisible(false);
          setIsColor(false);
          setIsSize(false);
        }}
        style={{ width: "40%" }}
      >
        <ColumnContainer>
          {isSize ? (
            <>
              <Text text="Please specify the size:" />
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="e.g. XS, S, M, L, XL, 2XL"
              />
            </>
          ) : isColor ? (
            <>
              <Text text="Please specify the color:" />
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="e.g. #096620, #000157, #7d0c1b"
              />
            </>
          ) : (
            <>
              <Text text="Please specify the class of the entry:" />
              <RowContainer>
                <Input
                  type="radio"
                  name="entryProps"
                  value="size"
                  onChange={() => setIsSize(true)}
                />
                <Text text="Size" style={{ marginLeft: 5, marginRight: 15 }} />
                <Input
                  type="radio"
                  name="entryProps"
                  value="color"
                  onChange={() => setIsColor(true)}
                />
                <Text text="Color" style={{ marginLeft: 5, marginRight: 15 }} />

                <Input
                  type="radio"
                  name="entryProps"
                  value="number"
                  onChange={() => handleAddItemProp()}
                />
                <Text
                  text="Amount"
                  style={{ marginLeft: 5, marginRight: 15 }}
                />
              </RowContainer>
            </>
          )}

          {(isSize || isColor) && (
            <Button
              text="Add Items"
              onPress={handleAddItemProp}
              style={{
                color: "white",
                borderColor: "white",
                borderWidth: 1,
              }}
            />
          )}
        </ColumnContainer>
      </Modal>
    </>
  );
};

export { MerchTable, MerchTableInput };
