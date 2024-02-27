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

const SignUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const signUp = async () => {
    const isValidEmail = (email: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };

    if (!firstName) {
      setError("Please enter your first name");
      return;
    } else if (!lastName) {
      setError("Please enter your last name");
      return;
    } else if (!email) {
      setError("Please enter your email");
      return;
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    } else if (!username) {
      setError("Please enter your username");
      return;
    } else if (!password) {
      setError("Please enter your password");
      return;
    } else if (!passwordRepeat) {
      setError("Please re-enter your password");
      return;
    } else if (password.length < 6) {
      setError("Your password must be at least 6 characters long");
      return;
    } else if (password !== passwordRepeat) {
      setError("Your passwords do not match");
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      re_password: passwordRepeat,
    };
    try {
      const res = await client.post("/register", body, config);
      if (res.data.success) {
        setNotification(
          "Sign up successful. Please check you mail to activate your account."
        );
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        setUsername("");
      } else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      setError("An error occured while signing up. Please try again.");
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
            <Text text="Sign Up" fontWeight="bold" fontSize={30} />
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
            />
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e)}
              placeholder="Old Password"
              isVisible={isPasswordVisible}
              setIsVisible={setIsPasswordVisible}
            />
            <PasswordInput
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e)}
              placeholder="Repeat New Password"
              isVisible={isPasswordRepeatVisible}
              setIsVisible={setIsPasswordRepeatVisible}
            />
            <Button text="Submit" onPress={signUp} />
          </ColumnContainer>
        </RowContainer>
      </Section>
    </>
  );
};

export default SignUp;
