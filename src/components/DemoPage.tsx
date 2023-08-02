import { RobotCredentials } from "../client";
import { useStore } from "../state";
import React, { FC, useEffect, useState } from "react";
import VideoStream from "./VideoStream";

const demo_robot = {
  name: "Demo Rover",
  hostname: process.env.REACT_APP_DEMO_BOT_HOSTNAME!,
  secret: process.env.REACT_APP_DEMO_BOT_SECRET!,
};

interface DemoPageProps {
  // Define props and propTypes here
}

const DemoPage: FC<DemoPageProps> = (props) => {
  console.log(window);
  const { status, connectOrDisconnect, streamClient } = useStore();

  const handleConnectButton = () => {
    const demoRobotCredentials = {
      hostname: demo_robot.hostname,
      secret: demo_robot.secret,
    };
    connectOrDisconnect(demoRobotCredentials);
  };

  return (
    <div className="w-full h-screen border border-gray-300 flex flex-col items-center justify-start">
      {/* <div className="border border-gray-700 p-4 flex flex-col space-y-4">
        <div className="">
          <h1 className="font-medium">Robot Overview</h1>
          <div className="">
            <p>{`Name: ${demo_robot.name}`}</p>
          </div>
        </div>
        <button
          onClick={handleConnectButton}
          className="px-4 py-2 bg-orange-500 rounded-md font-semibold text-white"
        >
          {status == "loading"
            ? "Loading..."
            : status == "connected"
            ? "Disconnect"
            : "Connect"}
        </button>
      </div> */}
      {/* {streamClient && (
        <div className="">
          <VideoStream streamClient={streamClient} />
        </div>
      )}
      <div className="py-4">
        <HistoricalData />
      </div> */}
    </div>
  );
};

export default DemoPage;
