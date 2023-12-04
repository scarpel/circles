import { TMessage, TMessageBlock } from "@customTypes/conversations";

export interface IMessageBlockProps {
  block: TMessageBlock;
}

export interface IMessageProps {
  message: TMessage;
  isSender?: boolean;
}
