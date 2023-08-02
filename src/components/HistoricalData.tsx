import React, { FC, useEffect, useState } from "react";
import { Card, LineChart, Title } from "@tremor/react";

interface HistoricalDataProps {
  // Define props and propTypes here
}
const HistoricalData: FC<HistoricalDataProps> = () => {
  async function fetchData() {
    const response = await fetch(process.env.REACT_APP_PYTHON_HTTP_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date_start: "2023-07-26 00:00:00",
        date_end: "2023-07-28 00:00:00",
        component_name: "wifi-sensor",
      }),
    });

    // Recommendation: handle errors
    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  }

  interface FakeHistoricalData {
    timestamp: string;
    linkReading: string;
    levelReading: string;
    noiseReading: string;
  }

  const [data, setData] = useState<FakeHistoricalData[]>();

  interface InputReadingsArray {
    ReadingName: string;
    Reading: string;
  }

  function parseReadings(readingsArray: InputReadingsArray[]) {
    const readings: Record<string, string> = {};

    readingsArray.forEach((readingObj) => {
      // Capitalize the reading names
      const readingName =
        readingObj.ReadingName.charAt(0).toUpperCase() +
        readingObj.ReadingName.slice(1) +
        " Reading";
      readings[readingName] = readingObj.Reading;
    });

    return readings;
  }

  useEffect(() => {
    fetchData().then((data) => {
      let initialTimestamp = new Date();
      let interval = 100000; // 1 second

      let flattenedData: any[] = []; // Replace any with your appropriate interface
      //@ts-ignore
      data.forEach((item) => {
        const readings = parseReadings(item.Readings);
        let readingTimestamp = new Date(initialTimestamp.getTime());

        flattenedData.push({
          timestamp: readingTimestamp.toISOString(),
          ...readings,
        });

        initialTimestamp = new Date(initialTimestamp.getTime() + interval);
      });

      console.log("flattenedData");
      console.log(flattenedData);
      setData(flattenedData);
    });
  }, []);

  return (
    <div className="">
      <label>
        Historical Data (via API that queries historical robot data w/ Python
        SDK){" "}
      </label>
      {data && (
        <Card>
          <Title>Wifi Sensor Data</Title>
          <LineChart
            className="mt-6"
            data={data}
            index="timestamp"
            categories={["Level Reading", "Link Reading", "Noise Reading"]}
            colors={["emerald", "blue", "orange"]}
            // valueFormatter={dataFormatter}
            yAxisWidth={40}
          />
        </Card>
      )}
    </div>
  );
};

export default HistoricalData;
