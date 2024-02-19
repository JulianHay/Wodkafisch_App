"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../../components/client";
import {
  Card,
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

const Sponsors = () => {
  const [seasonData, setSeasonData] = useState([]);
  const [seasonItemData, setSeasonItemData] = useState([]);
  const [sponsorData, setSponsorData] = useState([]);
  const [sponsorUserData, setUserSponsorData] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [promoData, setPromoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { router } = useRouter();

  const refresh = () => {
    setLoading(true);
    client
      .get("/sponsor")
      .then((res) => {
        setSponsorData(res.data.sponsor);
        setSeasonData(res.data.season);
        setSeasonItemData(res.data.season_items);
        setUserSponsorData(res.data.sponsor_user);
        setDonationData(res.data.donations);
        setPromoData(res.data.promo);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const promoDate = !loading
    ? moment(promoData[0].date.split(" ")[0])
    : moment();
  const isPromo = promoDate >= moment();

  const renderSponsors = (item) => (
    <div
      key={item.username}
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 3,
        left: -15,
      }}
    >
      <div style={{ width: 125, alignItems: "flex-end", marginRight: 10 }}>
        <Text style={{ left: 0 }} text={`${item.username}:`} />
      </div>
      <div style={styles.badgeImageContainer}>
        {item.diamond_sponsor !== 0 ? (
          <div style={{ flexDirection: "row" }}>
            <img src="diamond_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                justifyContent: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={8}
                text={`${item.diamond_sponsor > 1 ? item.diamond_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.black_sponsor !== 0 ? (
          <div style={{ flexDirection: "row" }}>
            <img src="black_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                justifyContent: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={8}
                text={`${item.black_sponsor > 1 ? item.black_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.gold_sponsor !== 0 ? (
          <div style={{ flexDirection: "row" }}>
            <img src="gold_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                justifyContent: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={8}
                text={`${item.gold_sponsor > 1 ? item.gold_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.silver_sponsor !== 0 ? (
          <div style={{ flexDirection: "row" }}>
            <img src="silver_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                justifyContent: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={8}
                text={`${item.silver_sponsor > 1 ? item.silver_sponsor : ""}`}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div style={styles.badgeImageContainer}>
        {item.bronze_sponsor !== 0 ? (
          <div style={{ flexDirection: "row" }}>
            <img src="bronze_badge.svg" style={styles.badgeImage} />
            <div
              style={{
                justifyContent: "flex-end",
                marginBottom: -2,
                marginLeft: -2,
              }}
            >
              <Text
                fontSize={8}
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
        margin: 5,
      }}
    >
      <Text text={`${item.date.split(" ")[0]}: ${item.value} `} />
      <img
        src="fisch_flakes.png"
        style={{ width: 15, height: 15, top: -1, marginLeft: 5 }}
      />
    </div>
  );

  return (
    <ProtectedRoute router={router}>
      {loading ? null : (
        <>
          <Section>
            <RowContainer style={{ width: "80%" }}>
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
                        text={`Season ${seasonData[0].id}`}
                      />
                    </div>
                    <div style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        text={seasonData[0].title}
                      />
                    </div>
                  </div>
                  <div>
                    <img
                      src={seasonData[0].image}
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
                  <div style={{ width: "95%", paddingTop: 10 }}>
                    <Battlepass
                      itemData={seasonItemData}
                      seasonData={seasonData}
                      sponsorData={sponsorUserData}
                    />
                  </div>
                  {/* <ProgressBar
                    duration={50}
                    containerWidth="95%"
                    maxPercentage={100}
                    startAnimation={true}
                    onAnimationEnd={() => {}}
                  /> */}
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
                        text={`Get ${promoData[0].value * 100}% more`}
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
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "80%",
              }}
            >
              <FlexCard
                title="Sponsor List"
                style={{ width: "65%", minWidth: 300 }}
              >
                {sponsorData.map((item) => renderSponsors(item))}
              </FlexCard>

              <FlexCard
                title="Recent Donations"
                style={{ width: "25%", minWidth: 195 }}
              >
                {donationData.slice(0, 5).map((item) => renderDonations(item))}
              </FlexCard>
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
  },
  badgeImage: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },
};

export default Sponsors;
