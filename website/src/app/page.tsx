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
import moment from "moment";
import Modal from "../../components/modal";
import { ProgressBar } from "./sponsors/utils";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const { isSignedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const itemUlockAmount = loading
    ? 0
    : data.season_items.find(
        (item) => item.price > data.sponsor[0].season_score
      );
  useEffect(() => {
    if (isSignedIn) {
      client
        .get("/home")
        .then((res) => {
          setData(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, []);

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
        <RowContainer style={{ alignItems: "center" }}>
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
  ) : loading ? (
    <></>
  ) : (
    <>
      <Section>
        <Text
          fontSize={32}
          fontWeight={"bold"}
          style={{ margin: 15 }}
          text={`Welcome ${data.sponsor[0].username}!`}
        />
        <RowContainer style={{ marginBottom: 40 }}>
          <TouchaleCard
            title="Upcoming Event"
            onPress={() => {
              setIsEventModalVisible(true);
            }}
          >
            {moment(data.upcoming_event[0].start, "YYYY-MM-DD") > moment() ? (
              <ColumnContainer
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 5,
                  height: "100%",
                }}
              >
                <Text text={data.upcoming_event[0].title} fontSize={16} />
                <img
                  src={
                    "https://wodkafis.ch/media/" + data.upcoming_event[0].image
                  }
                  style={{
                    width: 250,
                    height: 200,
                    objectFit: "contain",
                    margin: 5,
                  }}
                />
                <Text
                  text={moment(
                    data.upcoming_event[0].start,
                    "YYYY-MM-DD"
                  ).format("DD.MM.YYYY")}
                  fontSize={16}
                />
              </ColumnContainer>
            ) : (
              <ColumnContainer
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 5,
                  height: "100%",
                }}
              >
                <img
                  src={"/upcoming_event_fisch.png"}
                  style={{
                    width: 250,
                    height: 200,
                    objectFit: "contain",
                    margin: 5,
                  }}
                />
                <Text text="will be announced soon" fontSize={16} />
              </ColumnContainer>
            )}
          </TouchaleCard>
          <TouchaleCard
            title="Sponsorship"
            onPress={() => {
              router.push("/sponsors");
            }}
          >
            <ColumnContainer
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ColumnContainer
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data.sponsor[0].diamond_sponsor > 0 ||
                data.sponsor[0].black_sponsor > 0 ||
                data.sponsor[0].gold_sponsor > 0 ||
                data.sponsor[0].silver_sponsor > 0 ||
                data.sponsor[0].bronze_sponsor > 0 ? (
                  <>
                    <Text text="Your Sponsor Level:" />

                    <img
                      src={
                        data.sponsor[0].diamond_sponsor > 0
                          ? "/diamond_badge.png"
                          : data.sponsor[0].black_sponsor > 0
                          ? "/black_badge.png"
                          : data.sponsor[0].gold_sponsor > 0
                          ? "/gold_badge.png"
                          : data.sponsor[0].silver_sponsor > 0
                          ? "/silver_badge.png"
                          : data.sponsor[0].bronze_sponsor > 0
                          ? "/bronze_badge.png"
                          : null
                      }
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        marginTop: 10,
                        marginBottom: 15,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      text="Your Season Score:"
                      style={{ marginBottom: 10 }}
                    />
                  </>
                )}
              </ColumnContainer>

              <ProgressBar
                percentage={
                  (data.sponsor[0].season_score / data.season[0].max_donation) *
                  100
                }
                progress={progressBarValue}
                setProgress={setProgressBarValue}
                startAnimation={true}
                style={{ width: "80%", height: 20 }}
              />

              <Text
                text={`${data.sponsor[0].season_score}`}
                fontSize={14}
                style={{ position: "relative", transform: "translateY(-20px)" }}
              />

              {itemUlockAmount ? (
                <ColumnContainer
                  style={{
                    marginTop: -5,
                    alignItems: "center",
                  }}
                >
                  <RowContainer style={{ alignItems: "center" }}>
                    <Text
                      text={`Only ${
                        itemUlockAmount.price - data.sponsor[0].season_score
                      }`}
                    />

                    <img
                      src={"/fisch_flakes.png"}
                      style={{
                        width: 15,
                        height: 15,
                        marginLeft: 3,
                        marginRight: 3,
                      }}
                    />
                    <Text text="left to unlock:" />
                  </RowContainer>
                  <img
                    src={`https://wodkafis.ch/media/${
                      data.season_items.filter(
                        (item) => item.price > data.sponsor[0].season_score
                      )[0].image
                    }`}
                    style={{
                      width: 60,
                      height: 60,
                      marginTop: 10,
                      objectFit: "contain",
                    }}
                  />
                </ColumnContainer>
              ) : (
                <div style={{ marginTop: 5 }}>
                  <Text
                    text="You already unlocked all items in this season!"
                    fontSize={14}
                  />
                </div>
              )}
            </ColumnContainer>
          </TouchaleCard>
          <TouchaleCard
            title="Fisch Picture of the Day"
            onPress={() => {
              router.push("/pictures");
            }}
          >
            <ColumnContainer
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={`https://wodkafis.ch/${data.picture[0].image}`}
                style={{
                  width: "90%",
                  height: "80%",
                  objectFit: "cover",
                  overflow: "hidden",
                  borderRadius: 10,
                  margin: 5,
                }}
              />
              <Text text={data.picture[0].description} />
            </ColumnContainer>
          </TouchaleCard>
        </RowContainer>
      </Section>
      <Modal
        isVisible={isEventModalVisible}
        onClose={() => setIsEventModalVisible(false)}
        style={{ width: "60%" }}
      >
        <ColumnContainer>
          <Text
            text={data.upcoming_event[0].hello}
            style={{ marginBottom: 8 }}
          />
          <Text
            text={data.upcoming_event[0].message}
            style={{ marginBottom: 8 }}
          />
          <Text
            text={data.upcoming_event[0].additional_text}
            // .replace(
            //   /\s\s+/g,
            //   "\n"
            // )
            style={{ marginBottom: 8 }}
          />
          <Text text={data.upcoming_event[0].bye} />
          <Text text="Fisch" />
        </ColumnContainer>
      </Modal>
    </>
  );
}
