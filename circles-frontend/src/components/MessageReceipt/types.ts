import { ICommonComponentProps } from "@customTypes/common";
import { TMessage } from "@customTypes/conversations";

export interface IMessageReceiptProps extends ICommonComponentProps {
  message: TMessage;
  readClassName?: string;
}
