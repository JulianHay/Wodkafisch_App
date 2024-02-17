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
import { useSelector } from "react-redux";
import { Input } from "../../../../components/input";

const AddDonation = () => {
  const { router } = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [donation, setDonation] = useState<number>();
  const [error, setError] = useState("");
  const [addedDonations, setAddedDonations] = useState([]);
  console.log(addedDonations);
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
        setAddedDonations([
          ...addedDonations,
          { first_name: firstName, last_name: lastName, donation: donation },
        ]);
      } else {
        setError(
          "An error occured while adding donation. Please check first and last name."
        );
      }
    } catch (err) {
      setError("An error occured while adding donation. Please try again.");
    }
  };

  const addedDonaltionList = addedDonations.map((donation) => (
    <RowContainer
      key={donation.first_name + donation.last_name + donation.donation}
    >
      <Text text={donation.first_name + " " + donation.last_name + ":"} />
      <Text text={donation.donation + "€"} style={{ marginLeft: 10 }} />
    </RowContainer>
  ));

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
            <Button
              text="Submit"
              onPress={() => {
                addDonation(firstName, lastName, donation);
              }}
            />

            <ColumnContainer style={{ marginTop: 40 }}>
              <Text text="Added Donations" />
              {addedDonaltionList}
            </ColumnContainer>
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
};

const styles = {
  badgeImageContainer: {
    width: 25,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  badgeImage: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },
};

export default AddDonation;
