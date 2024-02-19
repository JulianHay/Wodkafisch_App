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
  const { router } = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isNewPasswordRepeatVisible, setIsNewPasswordRepeatVisible] =
    useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const resetPassword = async () => {
    if (!oldPassword) {
      setError("Please enter your old password");
      return;
    } else if (!newPassword) {
      setError("Please enter your new password");
      return;
    } else if (!newPasswordRepeat) {
      setError("Please re-enter your new password");
      return;
    } else if (newPassword.length < 6) {
      setError("Your new password must be at least 6 characters long");
      return;
    } else if (newPassword !== newPasswordRepeat) {
      setError("Your new passwords do not match");
      return;
    } else if (oldPassword === newPassword) {
      setError("Your new password cannot be the same as your old password");
      return;
    }

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    try {
      const res = await client.post("/password_change", body, config);
      if (res.data.success) {
        setNotification("Your password has been successfully changed");
        setOldPassword("");
        setNewPassword("");
        setNewPasswordRepeat("");
      } else {
        setError(
          "An error occured while changing your password. Please try again."
        );
      }
    } catch (err) {
      setError(
        "An error occured while changing your password. Please try again."
      );
    }
  };

  return (
    <ProtectedRoute router={router}>
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
            <PasswordInput
              value={oldPassword}
              setValue={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              type="password"
              isVisible={isOldPasswordVisible}
              setIsVisible={setIsOldPasswordVisible}
            />
            <PasswordInput
              value={newPassword}
              setValue={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              type="password"
              isVisible={isNewPasswordVisible}
              setIsVisible={setIsNewPasswordVisible}
            />
            <PasswordInput
              value={newPasswordRepeat}
              setValue={(e) => setNewPasswordRepeat(e.target.value)}
              placeholder="Repeat New Password"
              type="password"
              isVisible={isNewPasswordRepeatVisible}
              setIsVisible={setIsNewPasswordRepeatVisible}
            />
            <Button text="Submit" onPress={resetPassword} />
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedRoute>
  );
};

export default PasswordReset;
