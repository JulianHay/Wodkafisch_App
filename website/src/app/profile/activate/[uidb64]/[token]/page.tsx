"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../../../../../components/client";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../../../../components/containers";
import { Text } from "../../../../../../components/text";
import { useParams } from "next/navigation";

const ActivateAccount = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    activateAccount(uidb64, token);
  }, [uidb64, token]);

  const activateAccount = async (uidb64: string, token: string) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      token: token,
      uidb64: uidb64,
    };
    try {
      const res = await client.post(`/activate`, body, config);
      if (res.data.success) {
        setNotification(
          "Your account has been activated.\n Please wait for an admin to confirm your registration."
        );
      } else if (res.data.error) {
        setNotification(res.data.error);
      }
    } catch (err) {
      setNotification(
        "An error occured while activating your account.\n Please try again."
      );
    }
  };

  return (
    <>
      <Section>
        <RowContainer>
          <ColumnContainer
            style={{ width: "40%", marginTop: 40, alignItems: "center" }}
          >
            <Text text="Account Activation" fontWeight="bold" fontSize={30} />
            <ColumnContainer style={{ marginTop: 20 }}>
              {notification &&
                notification
                  .split("\n")
                  .map((text, index) => <Text key={index} text={text} />)}
            </ColumnContainer>
          </ColumnContainer>
        </RowContainer>
      </Section>
    </>
  );
};

export default ActivateAccount;
