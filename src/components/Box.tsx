import React, { FC } from "react";

interface BoxProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}
const Box: FC<BoxProps> = (props) => {
  return (
    <div
      className={`${
        props.className ? props.className : ""
      } bg-[#F4F4F4] rounded-md p-4 flex flex-col items-start justify-center`}
    >
      {props.title && (
        <div className="text-xl font-medium text-gray-700">
          <h1>{props.title}</h1>
        </div>
      )}
      {props.children}
    </div>
  );
};

export default Box;
