import classNames from "classnames";
import React, { useMemo } from "react";
import { IMessageReceiptProps } from "./types";

// Icons
import { FiCheck } from "react-icons/fi";

export default function MessageReceipt({
  message,
  className,
  readClassName = "text-blue-400",
}: IMessageReceiptProps) {
  // States
  const wasDelivered = useMemo(
    () => !!message.deliveredTo?.length,
    [message.deliveredTo]
  );

  // Render
  return (
    <div
      className={classNames(
        "receipts mr-1 mt-0.5 flex text-xs transition-colors ease-in-out duration-500",
        className,
        {
          [readClassName]: message.read,
        }
      )}
      title={wasDelivered ? "Sent" : "Delivered"}
    >
      <FiCheck />
      {wasDelivered && <FiCheck className="-ml-2" />}
    </div>
  );
}
