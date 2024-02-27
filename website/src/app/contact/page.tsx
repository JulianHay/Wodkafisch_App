"use client";
import React, { useState } from "react";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import { Input, MultilineInput } from "../../../components/input";
import { Button } from "../../../components/buttons";
import { ErrorMessage, Notification } from "../../../components/messages";
import { client } from "../../../components/client";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const sendMail = async () => {
    const isValidEmail = (email: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    if (!name) {
      setError("Please enter your name");
      return;
    } else if (!email) {
      setError("Please enter your email address");
      return;
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    } else if (!message) {
      setError("Please enter your message");
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      name: name,
      email: email,
      message: message,
    };
    try {
      const res = await client.post("/contact", body, config);
      if (res.data.success) {
        setNotification(
          "Thank you for contacting us. We will get back to you as soon as we can."
        );
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError(
          "An error occured while sending your message. Please try again."
        );
      }
    } catch (err) {
      setError(
        "An error occured while sending your message. Please try again."
      );
    }
  };
  return (
    <>
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
          <ColumnContainer style={{ width: "60%" }}>
            <Text
              text="Contact Us"
              fontSize={30}
              fontWeight="bold"
              style={{ marginTop: 40 }}
            />
            <Text
              text="If you have questions about the Wodkafisch or upcoming events or if you want to become a member, please contact us via the form below."
              style={{ marginTop: 20, marginBottom: 20 }}
            />

            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Please enter your name"
            />
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Please enter your email address"
            />
            <MultilineInput
              value={message}
              onChange={setMessage}
              placeholder="Please enter your message"
            />
            <Button text="Send" onPress={sendMail} />
          </ColumnContainer>
        </RowContainer>
      </Section>
    </>
  );
};

export default Contact;
