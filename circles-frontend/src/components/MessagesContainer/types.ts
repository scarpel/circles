import { ICommonComponentProps } from "@customTypes/common";
import { TMessage } from "@customTypes/conversations";
import { ReactNode } from "react";

export interface IMessagesContainerProps extends ICommonComponentProps {
  children: ReactNode | ReactNode[];
  messages: TMessage[];
  arrowOffset?: number;
  contentClassName?: string;
}
