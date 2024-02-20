"use client";
import { useEffect, useState } from "react";
import {
  ColumnContainer,
  RowContainer,
  Section,
  TouchaleCard,
} from "../../components/containers";
import { Input } from "../../components/input";
import { TextBlock, Text } from "../../components/text";
import { Button } from "../../components/buttons";
import { client } from "../../components/client";
import { ErrorMessage } from "../../components/messages";
import AuthService from "../../utils/auth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/reducers/userSlice";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isSignedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const login = async (username: string, password: string) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ username, password });
    try {
      const res = await client.post("/login", body, config);

      if (res.data.success) {
        return {
          username: username,
          accessToken: res.data.token,
          isSignedIn: true,
          isAdmin: res.data.is_admin,
        };
      }
    } catch (err) {
      setError("Username and Password do not match.");
    }
  };

  const router = useRouter();
  const onSignInPressed = async () => {
    if (!username) {
      setError("Please enter your username");
      return;
    } else if (!password) {
      setError("Please enter your password");
      return;
    }

    const userData = await login(username, password);
    if (userData) {
      dispatch(setUser(userData));
    }
    router.refresh();
  };

  return !isSignedIn ? (
    <>
      {error && (
        <ErrorMessage
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}

      <Section>
        <Text
          fontSize={32}
          fontWeight={"bold"}
          style={{ margin: 30 }}
          text="Welcome to the Wodkafisch Community"
        />
        <RowContainer>
          <ColumnContainer style={{ width: "50%", alignItems: "center" }}>
            <img src="/fisch.svg" />

            <Text
              fontSize={14}
              style={{ margin: 15 }}
              text="The Fisch app is now available on the App Store and on Google Play!"
            />
            <ColumnContainer style={{ alignItems: "center" }}>
              <RowContainer>
                <a
                  href="https://apps.apple.com/us/app/Wodkafisch/id6468836141"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Download on the App Store"
                    src="AppStoreDownload.svg"
                    style={{ height: 70, padding: 12 }}
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.wodkafisch.app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Get it on Google Play"
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    style={{ height: 70 }}
                  />
                </a>
              </RowContainer>
            </ColumnContainer>
          </ColumnContainer>
          <ColumnContainer style={{ width: "50%", alignItems: "center" }}>
            <ColumnContainer style={{ width: "30%" }}>
              <Text fontSize={24} text={"Sign In"} />
              <Input
                value={username}
                setValue={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="Username"
              />
              <Input
                value={password}
                setValue={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                type="password"
              />
              <Button
                text="Sign in"
                onPress={onSignInPressed}
                style={{ width: 80 }}
              />
              <Button
                text="Don't have an account? Sign up!"
                type="tertiary"
                onPress={() => {
                  router.push("/profile/signup");
                }}
                style={{}}
              />
              <Button
                text="Forgot password?"
                type="tertiary"
                onPress={() => {
                  router.push("/profile/password_reset");
                }}
                style={{}}
              />
            </ColumnContainer>
          </ColumnContainer>
        </RowContainer>
      </Section>
    </>
  ) : (
    <Section>
      <Text
        fontSize={32}
        fontWeight={"bold"}
        style={{ margin: 15 }}
        text={`Welcome ${username}!`}
      />
      <RowContainer>
        <TouchaleCard
          title="Upcoming Event"
          onPress={() => {
            router.push("/");
          }}
        >
          <img src="" style={{}} />
        </TouchaleCard>
        <TouchaleCard
          title="Sponsorship"
          onPress={() => {
            router.push("/sponsor");
          }}
        >
          <img src="" style={{}} />
        </TouchaleCard>
        <TouchaleCard
          title="Fisch Picture of the Day"
          onPress={() => {
            router.push("/pictures");
          }}
        >
          <img src="" style={{}} />
        </TouchaleCard>
      </RowContainer>
    </Section>
  );
}
