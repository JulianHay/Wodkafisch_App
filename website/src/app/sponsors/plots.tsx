import React, { PureComponent } from "react";
import moment from "moment";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";

interface Donation {
  date: string;
  value: number;
}

interface Event {
  start: string;
  country: string;
}
interface Item {
  price: number;
  image: string;
}
interface Season {
  title: string;
  max_donation: number;
  image: string;
  release_date: string;
}

interface CumulativeDonationChartProps {
  donations: Donation[];
  events: Event[];
}

interface SponsorDonationChartProps {
  donations: Donation[][];
  items: Item[];
  season: Season;
}

class DonationChartYAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload }: any = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={6} dx={-16} textAnchor="end" fill="white">
          {payload.value / 1000}k
        </text>
        <image href="/fisch_flakes.png" x={-13} y={-7} width={15} height={15} />
      </g>
    );
  }
}

const CumulativeDonationChart: React.FC<CumulativeDonationChartProps> = ({
  donations,
  events,
}) => {
  const computeCumulativeDonations = (donations: Donation[]) => {
    let cumulativeAmount = 0;
    const cumulativeDonationsMap: { [date: string]: number } = {};

    donations.forEach((donation) => {
      const date = moment(donation.date, "DD/MM/YYYY HH:mm").format(
        "DD/MM/YYYY"
      );
      cumulativeAmount += donation.value;
      cumulativeDonationsMap[date] =
        (cumulativeDonationsMap[date] || 0) + donation.value;
    });

    const cumulativeDonations: { date: string; cumulativeAmount: number }[] =
      [];
    let cumulativeSum = 0;
    for (const date in cumulativeDonationsMap) {
      cumulativeSum += cumulativeDonationsMap[date];
      cumulativeDonations.push({ date, cumulativeAmount: cumulativeSum });
    }

    return cumulativeDonations;
  };

  const data = computeCumulativeDonations(donations);

  return (
    <LineChart
      width={350}
      height={275}
      data={data}
      margin={{ top: 30, bottom: 5, right: 10, left: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="grey" />
      <XAxis dataKey="date" axisLine={{ stroke: "white" }} tick={false} />
      <YAxis
        // tickFormatter={(tick) => tick / 1000 + "k"}
        axisLine={{ stroke: "white" }}
        tick={<DonationChartYAxisTick />}
      />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div
                style={{
                  color: "#047d7f",
                  backgroundColor: "#20213c",
                  borderColor: "#047d7f",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                <p>{`Date: ${label}`}</p>
                <p>{`Amount: ${Math.round(
                  (payload[0].value as number) / 1000
                )}k`}</p>
              </div>
            );
          }
        }}
      />

      {events.map((event, index) => (
        <ReferenceLine
          key={index}
          x={moment(event.start).format("DD/MM/YYYY")}
          stroke="#047d7f"
          strokeWidth={2}
          strokeDasharray="3 3"
          label={{
            position: index % 2 === 0 ? "top" : "bottom",
            fill: "#047d7f",
            fontSize: 14,
            fontWeight: "bold",
            value:
              event.country === "United States of America"
                ? "USA"
                : event.country || "World",
          }}
        />
      ))}

      <Line
        type="stepAfter"
        dataKey="cumulativeAmount"
        stroke="#047d7f"
        dot={false}
        strokeWidth={4}
      />
    </LineChart>
  );
};

const SponsorDonationChart: React.FC<SponsorDonationChartProps> = ({
  donations,
  items,
  season,
}) => {
  const computeCumulativeDonations = (donations: Donation[]) => {
    let cumulativeAmount = 0;
    const cumulativeDonationsMap: { [date: string]: number } = {};

    cumulativeDonationsMap[moment(season.release_date).valueOf()] = 0;

    donations.forEach((donation) => {
      const date = moment(donation.date, "DD/MM/YYYY HH:mm").valueOf();
      cumulativeAmount += donation.value;
      cumulativeDonationsMap[date] =
        (cumulativeDonationsMap[date] || 0) + donation.value;
    });
    cumulativeDonationsMap[moment().valueOf()] = 0;
    const cumulativeDonations: { date: number; cumulativeAmount: number }[] =
      [];
    let cumulativeSum = 0;
    for (const date in cumulativeDonationsMap) {
      cumulativeSum += cumulativeDonationsMap[date];
      cumulativeDonations.push({
        date: parseFloat(date),
        cumulativeAmount: cumulativeSum,
      });
    }

    return cumulativeDonations;
  };

  const data = donations.map((donation) =>
    computeCumulativeDonations(donation)
  );

  const lineStyles = [
    { stroke: "#8884d8", strokeWidth: 2 }, // Blue
    { stroke: "#82ca9d", strokeWidth: 2, strokeDasharray: "3 3" }, // Green with dashed stroke
    { stroke: "#ffc658", strokeWidth: 2 }, // Yellow
    { stroke: "#ff7300", strokeWidth: 2, strokeDasharray: "5 5" }, // Orange with dashed stroke
    { stroke: "#ff85a2", strokeWidth: 2 }, // Pink
    { stroke: "#0088FE", strokeWidth: 2 }, // Dark blue
    { stroke: "#00C49F", strokeWidth: 2, strokeDasharray: "3 3" }, // Teal with dashed stroke
    { stroke: "#FFBB28", strokeWidth: 2 }, // Gold
    { stroke: "#FF8042", strokeWidth: 2, strokeDasharray: "5 5" }, // Coral with dashed stroke
    { stroke: "#FF1493", strokeWidth: 2 }, // Deep pink
    { stroke: "#1E90FF", strokeWidth: 2 }, // Dodger blue
    { stroke: "#00CED1", strokeWidth: 2, strokeDasharray: "3 3" }, // Dark turquoise with dashed stroke
    { stroke: "#ADFF2F", strokeWidth: 2 }, // Green-yellow
    { stroke: "#FFD700", strokeWidth: 2, strokeDasharray: "5 5" }, // Gold with dashed stroke
    { stroke: "#FF4500", strokeWidth: 2 }, // Orange red
    { stroke: "#7B68EE", strokeWidth: 2 }, // Medium slate blue
    { stroke: "#32CD32", strokeWidth: 2, strokeDasharray: "3 3" }, // Lime green with dashed stroke
    { stroke: "#FF69B4", strokeWidth: 2 }, // Hot pink
    { stroke: "#0000FF", strokeWidth: 2 }, // Electric blue
    { stroke: "#8A2BE2", strokeWidth: 2, strokeDasharray: "3 3" }, // Blue-violet with dashed stroke
    { stroke: "#8B0000", strokeWidth: 2 }, // Dark red
    { stroke: "#FFFF00", strokeWidth: 2, strokeDasharray: "5 5" }, // Yellow with dashed stroke
    { stroke: "#20B2AA", strokeWidth: 2 }, // Light sea green
    { stroke: "#CD5C5C", strokeWidth: 2, strokeDasharray: "3 3" }, // Indian red with dashed stroke
    { stroke: "#00BFFF", strokeWidth: 2 }, // Deep sky blue
    { stroke: "#00FF00", strokeWidth: 2, strokeDasharray: "5 5" }, // Lime with dashed stroke
    { stroke: "#FF6347", strokeWidth: 2 }, // Tomato
    { stroke: "#4B0082", strokeWidth: 2 }, // Indigo
    { stroke: "#2E8B57", strokeWidth: 2, strokeDasharray: "3 3" }, // Sea green with dashed stroke
    { stroke: "#FF7F50", strokeWidth: 2 }, // Coral
    { stroke: "#9370DB", strokeWidth: 2, strokeDasharray: "5 5" }, // Medium purple with dashed stroke
  ];

  function datesBetween(
    startDate: string,
    endDate: moment.Moment,
    numDates: number
  ) {
    const interval = endDate.diff(startDate) / (numDates - 1);
    const dates = [];

    for (let i = 0; i < numDates; i++) {
      const date = moment(startDate).add(interval * i, "milliseconds");
      dates.push(date.valueOf());
    }

    return dates;
  }

  return (
    <LineChart
      width={350}
      height={275}
      margin={{ top: 20, bottom: 5, right: 50, left: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="grey" />
      <XAxis
        dataKey="date"
        type="number"
        axisLine={{ stroke: "white" }}
        tick={{ fill: "white" }}
        domain={["dataMin", moment().valueOf()]}
        tickFormatter={(date) => moment(date).format("DD.MM.")}
        ticks={datesBetween(season.release_date, moment(), 5)}
      />
      <YAxis
        axisLine={{ stroke: "white" }}
        type="number"
        scale="linear"
        interval="equidistantPreserveStart"
        tick={<DonationChartYAxisTick />}
        domain={[0, items[items.length - 1].price + 1000]}
      />

      {data.map((entry, index) => {
        return (
          <Line
            key={index}
            type="stepAfter"
            dataKey="cumulativeAmount"
            stroke={lineStyles[index].stroke}
            // strokeDasharray={lineStyles[index].strokeDasharray}
            dot={false}
            strokeWidth={4}
            data={entry}
          />
        );
      })}

      {items.map((item, index) => (
        <ReferenceLine
          key={index}
          y={item.price}
          stroke="#047d7f"
          strokeWidth={2}
          strokeDasharray="10 5"
          label={
            <Label
              value={`${index}`}
              content={({ value, viewBox }) => {
                const { x, y, height, width }: any = viewBox;
                return (
                  <image
                    href={"https://wodkafis.ch/media/" + item.image}
                    x={width + x + 10}
                    y={y - 15}
                    width={30}
                    height={30}
                  />
                );
              }}
            />
          }
        />
      ))}
    </LineChart>
  );
};

export { CumulativeDonationChart, SponsorDonationChart };
