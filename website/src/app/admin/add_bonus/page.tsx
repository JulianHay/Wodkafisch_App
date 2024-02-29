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
import { AutocompleteInput, Input } from "../../../../components/input";
import moment from "moment";
import { RootState } from "@/lib/store";

const AddBonus = () => {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [value, setValue] = useState<number>();
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const { isAdmin } = useSelector((state: RootState) => state.user);

  const addBonus = async () => {
    if (!value) {
      setError("Please enter a bonus value");
      return;
    } else if (value < 0 || value > 100) {
      setError("  Please enter a value between 0 and 100");
      return;
    } else if (!date) {
      setError("Please enter a validity date");
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      value: value / 100,
      date: date,
    };
    try {
      const res = await client.post("/admin/add_bonus", body, config);
      if (res.data.success) {
        setNotification(
          `Successfully added a bonus of ${value}% until ${moment(date).format(
            "DD.MM.YYYY"
          )}`
        );
        setDate("");
        setValue(NaN);
      } else {
        setError("An error occured while adding the bonus. Please try again.");
      }
    } catch (err) {
      setError("An error occured while adding the bonus. Please try again.");
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
          <ColumnContainer style={{ width: "30%", marginTop: 40 }}>
            <Text
              text="Add Fischflocken Bonus"
              fontWeight="bold"
              fontSize={30}
            />

            <Input
              value={value as number}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              placeholder="Bonus in %"
              type="number"
            />
            <Input
              value={date}
              onChange={(e) => {
                setDate(e.target.value as string);
              }}
              placeholder="validity date"
              type="datetime-local"
            />

            <Button
              text="Submit"
              onPress={() => {
                addBonus();
              }}
            />
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
};

export default AddBonus;
