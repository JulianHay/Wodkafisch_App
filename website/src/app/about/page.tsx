import React from "react";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";

const About = () => {
  return (
    <Section>
      <RowContainer>
        <ColumnContainer style={{ width: "60%", alignItems: "center" }}>
          <Text
            text="About the Wodkafisch"
            fontSize={30}
            fontWeight="bold"
            style={{ margin: 40 }}
          />
          <ColumnContainer>
            <Text text="Origin" fontSize={24} fontWeight="bold" />
            <Text
              text="
          
          Little is known about the origins of the Wodkafisch. According
          to one myth, a former colleague brought the Wodkafisch to the
          Institute of Mechanics B, perhaps already at that time as Chauvifisch."
              style={{ marginTop: 20 }}
            />
            <Text
              text="
          Resurrection"
              fontSize={24}
              fontWeight="bold"
              style={{ marginTop: 20 }}
            />
            <Text
              text=" The Wodkafisch, but also the general development of
          society, has helped over time to create awareness of the issues of
          equality and respectful treatment and to punish discriminatory
          behavior. This has resulted in a positive development at the Institute
          in terms of the occurrence of chauvinism. "
              style={{ marginTop: 20 }}
            />
            <Text
              text="
          Present activities "
              fontSize={24}
              fontWeight="bold"
              style={{ marginTop: 20 }}
            />
            <Text
              text="
          Today,the Wodkafisch is committed to charitable causes and organizes events
          that promote intercultural exchange and the advancement of talented
          researchers."
              style={{ marginTop: 20, marginBottom: 60 }}
            />
          </ColumnContainer>
        </ColumnContainer>
      </RowContainer>
    </Section>
  );
};

export default About;
