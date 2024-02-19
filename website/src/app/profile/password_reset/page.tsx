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
import ProtectedRoute, {
  ProtectedAdminRoute,
} from "../../../../utils/protectedRoute";
import { ErrorMessage, Notification } from "../../../../components/messages";
import { Button } from "../../../../components/buttons";
import { useSelector } from "react-redux";
import {
  AutocompleteInput,
  Input,
  PasswordInput,
} from "../../../../components/input";

const PasswordReset = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] = useState(false);
  const [token, setToken] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const resetPasswordConfirmation = async () => {
    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const body = new FormData();
    body.append("email", email);
    try {
      const res = await client.post("/password_reset/", body, config);
      console.log(res.data);
      if (res.data.status === "OK") {
        setNotification(
          "An email has been sent to you with a link to reset your password. Please check your inbox."
        );
        setConfirmation(true);
      }
    } catch (err) {
      setError(Object.values(err.response.data)[0][0]);
    }
  };

  const resetPassword = async () => {
    if (!password) {
      setError("Please enter your new password");
      return;
    } else if (password.length < 6) {
      setError("Your new password must be at least 6 characters long");
      return;
    } else if (!passwordRepeat) {
      setError("Please re-enter your new password");
      return;
    } else if (password !== passwordRepeat) {
      setError("Your new passwords do not match");
      return;
    } else if (!token) {
      setError("Please enter the code you received in your email");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const body = new FormData();
    body.append("token", token);
    body.append("password", password);
    try {
      const res = await client.post("/password_reset/confirm/", body, config);
      console.log(res.data);
      if (res.data.status === "OK") {
        setNotification(
          "Your password has been successfully reset. Please log in with your new password."
        );
        setEmail("");
        setToken("");
        setPassword("");
        setPasswordRepeat("");
        router.push("/");
      }
    } catch (err) {
      console.log(err.response.data.detail);
      if (err.response.data.detail) {
        setError("Token is invalid.");
      } else {
        setError(Object.values(err.response.data)[0]);
      }
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
          <ColumnContainer style={{ width: "30%", marginTop: 40 }}>
            <Text text="Password Reset" fontWeight="bold" fontSize={30} />

            {confirmation ? (
              <>
                <PasswordInput
                  value={password}
                  setValue={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  isVisible={isPasswordVisible}
                  setIsVisible={setIsPasswordVisible}
                />
                <PasswordInput
                  value={passwordRepeat}
                  setValue={(e) => setPasswordRepeat(e.target.value)}
                  placeholder="Repeat Password"
                  isVisible={isPasswordRepeatVisible}
                  setIsVisible={setIsPasswordRepeatVisible}
                />

                <Input
                  value={token}
                  setValue={(e) => setToken(e.target.value)}
                  placeholder="Confirmation Code"
                />
                <Button text="Submit" onPress={resetPassword} />
              </>
            ) : (
              <>
                <Input
                  value={email}
                  setValue={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />

                <Button text="Submit" onPress={resetPasswordConfirmation} />
              </>
            )}
          </ColumnContainer>
        </RowContainer>
      </Section>
    </>
  );
};

export default PasswordReset;
