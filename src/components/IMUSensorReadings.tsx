import { Card, Metric, Title } from "@tremor/react";
import React, { FC } from "react";

interface IMUSensorReadingsProps {
  imuReadings: any;
}

function truncateToThreeDecimalPlaces(value: number): number {
  return Math.floor(value * 1000) / 1000;
}

const IMUSensorReadings: FC<IMUSensorReadingsProps> = (props) => {
  console.log(props.imuReadings);
  return (
    <div className="flex space-x-2">
      <Card>
        <Title>X</Title>
        <Metric>{truncateToThreeDecimalPlaces(props.imuReadings.x)}</Metric>
      </Card>
      <Card>
        <Title>Y</Title>
        <Metric>{truncateToThreeDecimalPlaces(props.imuReadings.y)}</Metric>
      </Card>
      <Card>
        <Title>Z</Title>
        <Metric>{truncateToThreeDecimalPlaces(props.imuReadings.z)}</Metric>
      </Card>
    </div>
  );
};

export default IMUSensorReadings;
