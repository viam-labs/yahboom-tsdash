import { useRef, useEffect, type ReactNode, FC } from "react";

export interface VideoStreamProps {
  stream?: MediaStream;
  children?: ReactNode;
  className?: string;
}

const VideoStream: FC<VideoStreamProps> = (props): JSX.Element => {
  const { stream, children } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`${
        props.className ? props.className : ""
      } relative inline-flex p-4`}
    >
      <video ref={videoRef} autoPlay muted />
      {children}
    </div>
  );
};

export default VideoStream;
