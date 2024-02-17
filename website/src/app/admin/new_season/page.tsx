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
import { ErrorMessage } from "../../../../components/messages";
import { Button } from "../../../../components/buttons";
import { Input } from "../../../../components/input";

const NewSeason = () => {
  const { router } = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [donation, setDonation] = useState<number>();
  const [error, setError] = useState("");
  const [addedDonations, setAddedDonations] = useState();
  const addDonation = async (
    firstName: string,
    lastName: string,
    donation: number
  ) => {
    if (!firstName) {
      setError("Please enter the sponsors first name");
      return;
    } else if (!lastName) {
      setError("Please enter the sponsors last name");
      return;
    } else if (!donation || donation <= 0) {
      setError("Please enter a donation amount > 0");
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      first_name: firstName,
      last_name: lastName,
      donation: donation,
    };
    try {
      const res = await client.post("/add_donation", body, config);
      if (res.data.success) {
        //
      } else {
        setError(
          "An error occured while adding donation. Please check first and last name."
        );
      }
    } catch (err) {
      setError("An error occured while adding donation. Please try again.");
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
      <Section>
        <RowContainer>
          <ColumnContainer style={{ width: "40%", marginTop: 40 }}>
            <Text text="Add Donation" />
            <Input
              value={firstName}
              setValue={setFirstName}
              placeholder="First Name"
            />
            <Input
              value={lastName}
              setValue={setLastName}
              placeholder="Last Name"
            />
            <Input
              value={donation}
              setValue={setDonation}
              placeholder="Donation Amount in €"
              type="number"
            />
            <Button text="Submit" onPress={() => {}} />
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
};

export default NewSeason;
