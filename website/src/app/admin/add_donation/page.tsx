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
import { RootState } from "@/lib/store";

interface User {
  first_name: string;
  last_name: string;
}

interface Donation extends User {
  donation: number;
}

interface UserList {
  firstName: string;
  lastName: string;
}

const AddDonation = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState("");
  const [donation, setDonation] = useState<number>();
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [addedDonations, setAddedDonations] = useState<Donation[]>([]);

  const [userFirstNames, setUserFirstNames] = useState<string[]>([]);
  const [userLastNames, setUserLastNames] = useState<string[]>([]);
  const [users, setUsers] = useState<UserList[]>([]);
  const { isAdmin } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (isAdmin) {
      client.get("/admin/user_list").then((res) => {
        setUsers(
          res.data.map((user: User) => {
            return { firstName: user.first_name, lastName: user.last_name };
          })
        );
        setUserFirstNames(res.data.map((user: User) => user.first_name));
        setUserLastNames(res.data.map((user: User) => user.last_name));
      });
    }
  }, [isAdmin, setUsers, setUserFirstNames, setUserLastNames]);

  useEffect(() => {
    const handleFirstNameChange = (firstName: string) => {
      if (firstName === "") {
        setLastName("");
        setUserFirstNames(users ? users.map((user) => user.firstName) : []);
        setUserLastNames(users ? users.map((user) => user.lastName) : []);
      } else {
        const filteredSuggestions = users.filter((user) =>
          user.firstName.toLowerCase().startsWith(firstName.toLowerCase())
        );
        setUserLastNames(filteredSuggestions.map((user) => user.lastName));
        if (filteredSuggestions.length === 1) {
          setLastName(filteredSuggestions[0].lastName);
        }
      }
    };
    handleFirstNameChange(firstName);
  }, [firstName]);

  useEffect(() => {
    const handleLastNameChange = (lastName: string) => {
      if (lastName === "" && firstName !== "") {
        setUserLastNames(users ? users.map((user) => user.lastName) : []);
      } else {
        const filteredSuggestions = users.filter((user) =>
          user.lastName.toLowerCase().startsWith(lastName.toLowerCase())
        );
        if (firstName === "") {
          setUserFirstNames(filteredSuggestions.map((user) => user.firstName));
        }
        if (filteredSuggestions.length === 1) {
          setFirstName(filteredSuggestions[0].firstName);
        }
      }
    };
    handleLastNameChange(lastName);
  }, [lastName]);

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
      const res = await client.post("/admin/add_donation", body, config);
      if (res.data.success) {
        setNotification(
          `Successfully added a donation of ${donation}€ for ${firstName} ${lastName}`
        );
        setAddedDonations([
          ...addedDonations,
          { first_name: firstName, last_name: lastName, donation: donation },
        ]);
        setFirstName("");
        setLastName("");
        setDonation(NaN);
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
      style={{ justifyContent: "flex-start" }}
    >
      <RowContainer style={{ width: "70%", justifyContent: "space-between" }}>
        <Text text={donation.first_name + " " + donation.last_name + ":"} />
        <Text text={donation.donation + "€"} style={{ marginLeft: 10 }} />
      </RowContainer>
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
            <Text text="Add Donation" fontWeight="bold" fontSize={30} />
            <AutocompleteInput
              value={firstName}
              onChange={(e) => setFirstName(e as string)}
              placeholder="First Name"
              options={userFirstNames}
            />
            <AutocompleteInput
              value={lastName}
              onChange={(e) => setLastName(e as string)}
              placeholder="Last Name"
              options={userLastNames}
              allowEmpty={
                firstName !== "" && userFirstNames.includes(firstName)
              }
            />
            <Input
              value={donation as number}
              onChange={(e) => {
                setDonation(parseFloat(e.target.value));
              }}
              placeholder="Donation Amount in €"
              type="number"
            />
            <Button
              text="Submit"
              onPress={() => {
                addDonation(firstName, lastName, donation as number);
              }}
            />

            {addedDonations.length > 0 ? (
              <ColumnContainer style={{ marginTop: 40 }}>
                <Text text="Added Donations" fontWeight="bold" fontSize={30} />
                {addedDonaltionList}
              </ColumnContainer>
            ) : null}
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
