import React, { FC, useEffect, useState } from "react";
import {
  Bold,
  Card,
  Grid,
  Metric,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";

type RawOutput = {
  "df -h": { stderr: string; stdout: string };
  iwconfig: { stderr: string; stdout: string };
  uptime: { stderr: string; stdout: string };
};

interface OSModuleDashProps {
  osData: RawOutput;
}

const OSModuleDash: FC<OSModuleDashProps> = (props) => {
  type ParsedOutput = {
    diskSpace: {
      root: {
        total: string;
        used: string;
        available: string;
        usagePercent: string;
      };
      boot: {
        total: string;
        used: string;
        available: string;
        usagePercent: string;
      };
    };
    wifi: {
      interface: string;
      essid: string;
      quality: string;
      signalLevel: string;
      protocol: string;
      bitRate: string;
      powerManagement: string;
    };
    uptime: {
      currentTime: string;
      upTime: string;
      loadAverage: string[];
    };
  };

  function parseOutput(raw: RawOutput): ParsedOutput {
    const dfLines = raw["df -h"].stdout.split("\n");
    const rootLine =
      dfLines.find((line) => line.includes("/dev/root"))?.split(/\s+/) || [];
    const bootLine =
      dfLines.find((line) => line.includes("/dev/mmcblk0p1"))?.split(/\s+/) ||
      [];

    const iwconfigLines = raw["iwconfig"].stdout.split("\n");
    const wlanLine = iwconfigLines.find((line) => line.includes("wlan0")) || "";

    const uptimeLine = raw["uptime"].stdout.split(",");

    return {
      diskSpace: {
        root: {
          total: rootLine[1],
          used: rootLine[2],
          available: rootLine[3],
          usagePercent: rootLine[4],
        },
        boot: {
          total: bootLine[1],
          used: bootLine[2],
          available: bootLine[3],
          usagePercent: bootLine[4],
        },
      },
      wifi: {
        interface: "wlan0",
        essid: wlanLine?.split('ESSID:"')[1]?.split('"')[0] || "",
        quality: wlanLine?.split("Link Quality=")[1]?.split(" ")[0] || "",
        signalLevel: wlanLine?.split("Signal level=")[1]?.split(" ")[0] || "",
        protocol: wlanLine?.split("IEEE ")[1]?.split(" ")[0] || "",
        bitRate: wlanLine?.split("Bit Rate=")[1]?.split(" ")[0] || "",
        powerManagement: wlanLine?.includes("Power Management:on")
          ? "on"
          : "off",
      },
      uptime: {
        currentTime: uptimeLine[0]?.trim()?.split(" up ")[0],
        upTime: uptimeLine[0]?.trim()?.split(" up ")[1],
        loadAverage: uptimeLine[2]
          ?.trim()
          ?.split("load average: ")[1]
          ?.split(", "),
      },
    };
  }

  // Initialize state for the parsed data
  const [parsedData, setParsedData] = useState<ParsedOutput | null>(null);

  // Parse data whenever osData changes
  useEffect(() => {
    if (!props.osData) return;
    setParsedData(parseOutput(props.osData));
  }, [props.osData]);

  // Make sure parsedData is not null before rendering
  if (!parsedData) return null;

  return (
    <>
      <Title className="">Robot System Stats</Title>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-4">
        <Card>
          <Text>
            <Bold>Root Disk</Bold>
          </Text>
          <Text>Total: {parsedData.diskSpace.root.total}</Text>
          <Text>Used: {parsedData.diskSpace.root.used}</Text>
          <Text>Available: {parsedData.diskSpace.root.available}</Text>
          <ProgressBar
            color="indigo"
            value={parseInt(parsedData.diskSpace.root.usagePercent, 10)}
            className="mt-3"
          />
        </Card>
        <Card>
          <Text>
            <Bold>Boot Disk</Bold>
          </Text>
          <Text>Total: {parsedData.diskSpace.boot.total}</Text>
          <Text>Used: {parsedData.diskSpace.boot.used}</Text>
          <Text>Available: {parsedData.diskSpace.boot.available}</Text>
          <ProgressBar
            color="indigo"
            value={parseInt(parsedData.diskSpace.boot.usagePercent, 10)}
            className="mt-3"
          />
        </Card>
        {/* WiFi Card */}
        <Card>
          <Text>
            <Bold>Wifi</Bold>
          </Text>
          <Text>Interface: {parsedData.wifi.interface}</Text>
          <Text>ESSID: {parsedData.wifi.essid}</Text>
          <Text>Quality: {parsedData.wifi.quality}</Text>
          <Text>Signal Level: {parsedData.wifi.signalLevel}</Text>
          <Text>Protocol: {parsedData.wifi.protocol}</Text>
          <Text>Bit Rate: {parsedData.wifi.bitRate}</Text>
          <Text>Power Management: {parsedData.wifi.powerManagement}</Text>
        </Card>

        {/* Uptime Card */}
        <Card>
          <Text>
            <Bold>Uptime</Bold>
          </Text>
          <Text>Current Time: {parsedData.uptime.currentTime}</Text>
          <Text>Up Time: {parsedData.uptime.upTime}</Text>
          <Text>Load Average: {parsedData.uptime.loadAverage?.join(", ")}</Text>
        </Card>
        {/* You can add more cards for other data as needed. */}
      </Grid>
    </>
  );
};

export default OSModuleDash;
