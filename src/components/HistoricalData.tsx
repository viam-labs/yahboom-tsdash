import React, { FC } from "react";

interface HistoricalDataProps {
  // Define props and propTypes here
}
const HistoricalData: FC<HistoricalDataProps> = () => {
  async function fetchData() {
    const response = await fetch(
      "https://us-west1-gtm-tools-370017.cloudfunctions.net/python-http-function",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_start: "2023-07-26 00:00:00",
          date_end: "2023-07-28 00:00:00",
          component_name: "wifi-sensor",
        }),
      }
    );

    // Recommendation: handle errors
    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  }

  fetchData().then((data) => {
    console.log(data);
  });
  return (
    <div className="">
      <h1>Historical Data</h1>
      <div className="flex space-x-2 italic">
        <label>wifi-sensor</label> <span>|</span> <label>July X - July Y</label>
      </div>
      <div className="">display data here</div>
    </div>
  );
};

export default HistoricalData;
