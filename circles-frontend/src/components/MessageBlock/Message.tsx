import React, { useMemo } from "react";
import { IMessageProps } from "./types";
import moment from "moment";
import classNames from "classnames";
import MessageReceipt from "@components/MessageReceipt";

export default function Message({ message, isSender }: IMessageProps) {
  // States
  const time = useMemo(
    () => moment(message.sendAt).format("HH:mm"),
    [message.sendAt]
  );

  const { className, containerClassName } = useMemo(
    () =>
      isSender
        ? {
            className: "text-right bg-gray-200",
            containerClassName: "justify-end",
          }
        : {
            className: "text-left bg-blue-400",
            containerClassName: "",
          },
    [isSender]
  );

  // Render
  const renderReceipts = () => {
    if (!isSender) return null;

    return <MessageReceipt message={message} />;
  };
  return (
    <div
      className={classNames(
        "message px-4 py-2 rounded-2xl max-w-xl",
        className
      )}
    >
      <p className="m-0 p-0 text-sm">{message.content}</p>

      <div className={classNames("flex items-center", containerClassName)}>
        {renderReceipts()}

        <p className="time m-0 p-0 mt-1 text-2xs leading-none font-semibold">
          {time}
        </p>
      </div>
    </div>
  );
}
