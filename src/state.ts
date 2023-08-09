import { create } from "zustand";
import { useEffect, useRef, useState } from "react";
import type {
  RobotClient,
  StreamClient,
  BaseClient,
  SensorClient,
  MovementSensorClient,
} from "@viamrobotics/sdk";
import {
  RobotCredentials,
  getRobotClient,
  getStreamClient,
  getIMUMovementSensorClient,
  getBaseClient,
  getOSStatsSensorClient,
} from "./client";

export type ClientStatus = "disconnected" | "loading" | "connected";

export interface Store {
  status: ClientStatus;
  client?: RobotClient;
  streamClient?: StreamClient;
  imuMovementSensorClient?: MovementSensorClient;
  osStatsSensorClient?: SensorClient;
  baseClient?: BaseClient;
  connectOrDisconnect: (credentials: RobotCredentials) => unknown;
}

export const useStore = create<Store>((set, get) => ({
  status: "disconnected",
  client: undefined,
  streamClient: undefined,
  baseClient: undefined,
  imuMovementSensorClient: undefined,
  osStatsSensorClient: undefined,
  connectOrDisconnect: (credentials: RobotCredentials) => {
    const status = get().status;
    if (status === "disconnected") {
      console.log(`Currently disconnected, connecting...`);
      console.log("Setting state to 'loading'...");
      set({ status: "loading" });

      console.log(
        `Getting robot client for credentials ${JSON.stringify(
          credentials,
          null,
          2
        )}`
      );
      getRobotClient(credentials)
        .then((client) => {
          console.log(`Got client ${client}`);
          console.log(`Getting stream client`);
          const streamClient = getStreamClient(client);
          console.log(
            `Received stream client ${JSON.stringify(streamClient, null, 2)}`
          );
          console.log(`Getting base client`);
          const baseClient = getBaseClient(client);
          console.log(
            `Received base client ${JSON.stringify(baseClient, null, 2)}`
          );

          const imuMovementSensorClient = getIMUMovementSensorClient(client);
          console.log(
            `Received sensor client ${JSON.stringify(
              imuMovementSensorClient,
              null,
              2
            )}`
          );

          const osStatsSensorClient = getOSStatsSensorClient(client);
          console.log(
            `Received sensor client ${JSON.stringify(
              osStatsSensorClient,
              null,
              2
            )}`
          );

          const stateUpdate = {
            status: "connected",
            client,
            imuMovementSensorClient,
            osStatsSensorClient,
            baseClient,
            streamClient,
          };
          console.log(
            `Setting state to connected: ${JSON.stringify(
              stateUpdate,
              null,
              2
            )}`
          );
          //@ts-ignore
          set({ ...stateUpdate });
          console.log("Set state to connected");
        })
        .catch((error: unknown) => set({ status: "disconnected" }));
    } else if (status === "connected") {
      console.log(`Currently connected, disconnecting...`);
      set({ status: "loading" });

      get()
        ?.client?.disconnect()
        .then(() => set({ status: "disconnected" }))
        .catch((error: unknown) => set({ status: "disconnected" }));
    }
  },
}));

export const useStream = (
  streamClient: StreamClient | undefined,
  cameraName: string
): MediaStream | undefined => {
  const okToConnectRef = useRef(true);
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    if (streamClient && okToConnectRef.current) {
      okToConnectRef.current = false;

      streamClient
        .getStream(cameraName)
        .then((mediaStream) => setStream(mediaStream))
        .catch((error: unknown) => {
          console.warn(`Unable to connect to camera ${cameraName}`, error);
        });

      return () => {
        okToConnectRef.current = true;

        streamClient.remove(cameraName).catch((error: unknown) => {
          console.warn(`Unable to disconnect to camera ${cameraName}`, error);
        });
      };
    }

    return undefined;
  }, [streamClient, cameraName]);

  return stream;
};
