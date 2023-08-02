import { useStream } from "../state";
import { StreamClient } from "@viamrobotics/sdk";
import { useRef, useEffect, type ReactNode, FC, useState } from "react";

export interface VideoStreamProps {
  streamClient: StreamClient;
}

const VideoStream: FC<VideoStreamProps> = ({ streamClient }): JSX.Element => {
  const stream = useStream(streamClient, "cam");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("stream", stream);
    console.log(stream?.getVideoTracks());
    if (videoRef.current && stream) {
      console.log(`effect check :${videoRef.current && stream}`);
      console.log(`video ref: ${videoRef.current}`);
      console.log(`stream: ${stream}`);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCount(count + 1); // hack to force a re-render when we have a video stream so the video element will show up
    } else {
      console.log(`video ref: ${videoRef.current}`);
      console.log(`stream: ${stream}`);

      setCount(count + 1); // hack to force a re-render when we don't have a video stream so the video element will disappear
    }
  }, [stream]);

  return (
    <div className="flex flex-col space-y-2 p-4">
      <label>Camera Feed({count})</label>
      {stream && (
        <video
          className="border-2 border-gray-500"
          ref={videoRef}
          autoPlay
          playsInline
          muted
        ></video>
      )}
    </div>
  );
};
export default VideoStream;
