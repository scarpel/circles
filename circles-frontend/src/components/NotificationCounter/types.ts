import { ICommonComponentProps } from "@customTypes/common";

export interface INotificationCenterProps extends ICommonComponentProps {
  numberOfNotification: number;
  truncateAt?: number;
  textClassName?: string;
}
