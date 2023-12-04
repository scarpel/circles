import { ReactNode } from "react";

export type TLayoutProps = {
  children: ReactNode;
};

export type TObject<V> = { [key: string]: V };

export type IComponent<P = any> = (props: P) => ReactNode;

export type TIconProps = {
  fill?: string;
  width?: string | number;
  height?: string | number;
  stroke?: string;
  className?: string;
  size?: number | string;
};

export interface ICommonComponentProps {
  className?: string;
}

export enum RecordStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export type TUserAction = {
  userId: string;
  at: number;
};

export type TSize = "sm" | "md" | "lg" | "xl";
