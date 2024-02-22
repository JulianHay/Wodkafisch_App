"use client";
import React, { useEffect, useRef, useState } from "react";
import { client } from "../../../components/client";
import {
  Card,
  ColumnContainer,
  FlexCard,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../utils/protectedRoute";
import { ErrorMessage } from "../../../components/messages";
import moment from "moment";
import { Button } from "../../../components/buttons";
import Battlepass, { ProgressBar } from "./utils";
import { useSelector } from "react-redux";
import { CumulativeDonationChart, SponsorDonationChart } from "./plots";

const Sponsors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const sponsorListRef = useRef(null);
  const { router } = useRouter();
  const { isSignedIn } = useSelector((state) => state.user);
  const refresh = () => {
    setLoading(true);
    client
      .get("/sponsor")
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSignedIn) {
      refresh();
    }
  }, []);

  const promoDate = !loading
    ? moment(data.promo[0].date.split(" ")[0])
    : moment();
  const isPromo = promoDate >= moment();

  const renderSponsors = (item) => (
    <div
      key={item.username}
      style={{
        display: "flex",
        flexDirection: "row",
        margin: 10,
        marginRight: 15,
        // left: -15,
      }}
    >
      <div style={{ width: 140, alignItems: "flex-end" }}>
        <Text
          style={{ left: 0, textAlign: "right" }}
          text={`${item.username}:`}
        />
      </div>

      <div
        style={{
          width: 40 * data.season[0].id,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {item.season_badges.map((badge) => (
          <div style={styles.badgeImageContainer}>
            <img
              src={`https://wodkafis.ch/media/${badge}`}
              style={styles.badgeImage}
            />
          </div>
        ))}
      </div>
      {/*           
//     width: 15,
//     height: 15,
//     marginLeft: 2, */}
      <div style={styles.badgeImageContainer}>
        {item.diamond_sponsor !== 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="diamond_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                text={`${item.diamond_sponsor > 1 ? item.diamond_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.black_sponsor !== 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="black_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                text={`${item.black_sponsor > 1 ? item.black_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.gold_sponsor !== 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="gold_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                text={`${item.gold_sponsor > 1 ? item.gold_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.silver_sponsor !== 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="silver_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                text={`${item.silver_sponsor > 1 ? item.silver_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.bronze_sponsor !== 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="bronze_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={10}
                fontWeight="bold"
                text={`${item.bronze_sponsor > 1 ? item.bronze_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderDonations = (item) => (
    <div
      key={item.date + item.value + item.username}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        margin: 2,
      }}
    >
      <Text
        text={`${moment(item.date, "DD/MM/YYYY HH:mm").format(
          "DD.MM.YYYY HH:mm"
        )}: `}
        style={{ width: 165, marginRight: 5 }}
      />
      <RowContainer
        style={{ width: 80, justifyContent: "flex-end", alignItems: "center" }}
      >
        <Text text={`${item.value}`} />
        <img
          src="/fisch_flakes.png"
          style={{ width: 15, height: 15, top: -1, marginLeft: 5 }}
        />
      </RowContainer>
    </div>
  );

  return (
    <ProtectedRoute router={router}>
      {loading ? null : (
        <>
          <Section>
            <RowContainer style={{ width: "71.5%" }}>
              <FlexCard
                title="Battle Pass"
                style={{ width: "100%", minWidth: 400 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {/* Season */}
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom, #c59c34, #9a690e)",
                      width: "95%",
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid #fff",
                      fontWeight: "bold",
                      margin: 20,
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    <div>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        text={`Season ${data.season[0].id}`}
                      />
                    </div>
                    <div style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        text={data.season[0].title}
                      />
                    </div>
                  </div>
                  <div>
                    <img
                      src={`https://wodkafis.ch/media/${data.season[0].image}`}
                      style={{
                        position: "relative",
                        maxHeight: 60,
                        maxWidth: 180,
                        left: "50%",
                        transform: "translateX(-50%) translateY(-100%)",
                        top: -10,
                        marginBottom: -78,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: "95%", paddingTop: 20 }}>
                    <Battlepass
                      itemData={data.season_items}
                      seasonData={data.season}
                      sponsorData={data.sponsor_user}
                    />
                  </div>
                  {/* Promo */}
                  {isPromo ? (
                    <div
                      style={{
                        marginTop: 25,
                        marginBottom: -10,
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        fontSize={12}
                        text={`Get ${data.promo[0].value * 100}% more`}
                      />
                      <img
                        src="fisch_flakes.png"
                        style={{
                          width: 12,
                          height: 12,
                          marginLeft: 3,
                          marginRight: 3,
                          marginTop: 3,
                        }}
                      />
                      <Text
                        fontSize={12}
                        text={`for your donations until ${promoDate.format(
                          "DD/MM/YYYY"
                        )}!`}
                      />
                    </div>
                  ) : null}
                  {/* Donation Button */}
                  <div style={{ marginTop: 20, marginBottom: 5 }}>
                    <Button
                      onPress={() => {
                        window.open("http://paypal.me/wodkafisch", "_blank");
                      }}
                      text={"Donate now"}
                      style={{
                        color: "white",
                        backgroundColor: "#000022",
                        borderColor: "#19203c",
                        width: 140.667,
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}
                    />
                    <div
                      onClick={() => {
                        window.open("http://paypal.me/wodkafisch", "_blank");
                      }}
                      style={{ top: -48, left: -13, marginBottom: -30 }}
                    >
                      <img
                        src="fisch_flakes.png"
                        style={{
                          width: 35,
                          height: 35,
                          transform: "translateY(-100%)",
                          position: "relative",
                          top: -10,
                          left: -10,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </FlexCard>
            </RowContainer>
          </Section>
          <Section>
            <RowContainer
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                width: "71.5%",
              }}
            >
              <FlexCard
                ContainerRef={sponsorListRef}
                title="Sponsor List"
                style={{ width: 450 }}
              >
                {data.sponsor.map((item) => renderSponsors(item))}
              </FlexCard>

              <ColumnContainer
                style={{
                  height: sponsorListRef.current?.offsetHeight || "100%",
                  width: 375,
                  margin: 15,
                  justifyContent: "space-between",
                }}
              >
                <FlexCard
                  title="Recent Donations"
                  style={{ width: "100%", minWidth: 195, margin: 0 }}
                >
                  <ColumnContainer
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <ColumnContainer style={{ justifyContent: "flex-start" }}>
                      {data.donations
                        .slice(0, 7)
                        .map((item) => renderDonations(item))}
                    </ColumnContainer>
                  </ColumnContainer>
                </FlexCard>

                <FlexCard
                  title="Fisch Balance"
                  style={{
                    width: "100%",
                    minWidth: 195,
                    margin: 0,
                  }}
                >
                  <RowContainer
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CumulativeDonationChart
                      donations={data.donations.slice().reverse()}
                      events={data.events}
                    />
                  </RowContainer>
                </FlexCard>

                <FlexCard
                  title="Season Scores"
                  style={{ width: "100%", minWidth: 195, margin: 0 }}
                >
                  <RowContainer
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SponsorDonationChart
                      donations={data.user_donations}
                      items={data.season_items}
                      season={data.season[0]}
                    />
                  </RowContainer>
                </FlexCard>
              </ColumnContainer>
            </RowContainer>
          </Section>
        </>
      )}
    </ProtectedRoute>
  );
};

const styles = {
  badgeImageContainer: {
    width: 25,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    display: "flex",
    marginLeft: 15,
  },
  badgeImage: {
    maxWidth: 25,
    maxHeight: 25,
    marginLeft: 2,
  },
};

export default Sponsors;
