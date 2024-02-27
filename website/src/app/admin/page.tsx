"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../../components/containers";
import { Text } from "../../../components/text";
import { useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "../../../utils/protectedRoute";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();

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

export default Admin;
