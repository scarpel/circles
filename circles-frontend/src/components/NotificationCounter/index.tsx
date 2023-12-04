import React, { useMemo } from "react";
import { INotificationCenterProps } from "./types";
import classNames from "classnames";

export default function NotificationCounter({
  numberOfNotification,
  className,
  truncateAt = 9,
  textClassName,
}: INotificationCenterProps) {
  // States
  const formattedNumber = useMemo(
    () =>
      numberOfNotification > truncateAt
        ? `${truncateAt}+`
        : numberOfNotification,
    [numberOfNotification, truncateAt]
  );

  // Render
  if (!numberOfNotification) return null;

  return (
    <div
      className={classNames(
        "notification-counter bg-red-500 w-7 h-7 rounded-full flex-center",
        className
      )}
    >
      <p
        className={classNames(
          "notification-counter-text text-xs text-center m-0 p-0 font-medium text-white",
          textClassName
        )}
      >
        {formattedNumber}
      </p>
    </div>
  );
}
