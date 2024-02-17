"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../../components/client";
import {
  Card,
  FlexCard,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import { useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "../../../utils/protectedRoute";
import { ErrorMessage } from "../../../components/messages";
import { Button } from "../../../components/buttons";
import { useSelector } from "react-redux";
import { Input } from "../../../components/input";

const AddDonation = () => {
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { router } = useRouter();

  const [fisrtName, setFisrtName] = useState("");
  const [lastName, setLastName] = useState("");
  const [donation, setDonation] = useState<number>(0);

  return (
    <ProtectedAdminRoute router={router}>
      <Section>
        <Text text="Admin" />
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
