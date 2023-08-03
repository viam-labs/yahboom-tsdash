import React, { FC } from "react";
import { Map, Marker } from "pigeon-maps";

export interface GPSPos {
  altitudeM: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

interface GPSLocationProps {
  gpsPosition?: GPSPos | null;
}
const GPSLocation: FC<GPSLocationProps> = (props) => {
  return (
    <div className="h-full w-full rounded-md overflow-hidden">
      <Map
        defaultCenter={[
          props.gpsPosition?.coordinate.latitude!,
          props.gpsPosition?.coordinate.longitude!,
        ]}
      >
        <Marker
          width={50}
          anchor={[
            props.gpsPosition?.coordinate.latitude!,
            props.gpsPosition?.coordinate.longitude!,
          ]}
          payload={1}
          onClick={({ event, anchor, payload }) => {}}
        />
      </Map>
    </div>
  );
};

export default GPSLocation;
