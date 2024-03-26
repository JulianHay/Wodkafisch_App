"use client";
import React, { useState } from "react";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../../components/containers";
import { Text } from "../../../../components/text";
import ProtectedRoute from "../../../../utils/protectedRoute";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/buttons";
import Modal from "../../../../components/modal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ErrorMessage, Notification } from "../../../../components/messages";
import { setUser } from "@/lib/reducers/userSlice";
import { client } from "../../../../components/client";

const DeleteAccount = () => {
  const router = useRouter();

  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const { username, accessToken, isSignedIn, isAdmin } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  return (
    <ProtectedRoute router={router}>
      <Section>
        <RowContainer>
          <ColumnContainer style={{ width: "60%", alignItems: "center" }}>
            <Text
              text="Remove Account"
              fontSize={30}
              fontWeight="bold"
              style={{ marginTop: 10, marginBottom: 10 }}
            />
            <ColumnContainer style={{ width: "80%", alignItems: "flex-start" }}>
              <Text text="If you want to delete your account, please click the button below." />
              <Text text="This will delete your account permanently." />
            </ColumnContainer>
            <Button
              text="Remove Account"
              onPress={() => {
                setIsDeleteAccountModalVisible(true);
              }}
              style={{ margin: 10 }}
            />
          </ColumnContainer>
        </RowContainer>
      </Section>
      <Modal
        isVisible={isDeleteAccountModalVisible}
        onClose={() => {
          setIsDeleteAccountModalVisible(false);
        }}
        style={{ width: "40%" }}
      >
        <Text text="Do you really want to delete your account?" />
        <Button
          text="Confirm"
          type="secondary"
          onPress={async () => {
            const config = {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            };
            const body = {
              username: username,
            };
            const res = await client.post("/remove-account", body, config);
            if (res.data.success) {
              setNotification("Successfully deleted your account.");
              dispatch(
                setUser({
                  username: null,
                  accessToken: null,
                  isSignedIn: false,
                  isAdmin: false,
                })
              );
              setIsDeleteAccountModalVisible(false);
              router.push("/");
              router.refresh();
            } else {
              setError(
                "An error occured while deleting your account. Please try again."
              );
            }
          }}
          style={{ borderColor: "white", color: "white", marginTop: 15 }}
        />
      </Modal>
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
    </ProtectedRoute>
  );
};

export default DeleteAccount;
