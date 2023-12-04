import { ICommonComponentProps } from "@customTypes/common";
import { TConversationInfo } from "@customTypes/conversations";

export interface IConversationListProps extends ICommonComponentProps {
  conversations: TConversationInfo[];
  onClick: (conversation: TConversationInfo) => void;
}

export interface IConversationListItemProps extends ICommonComponentProps {
  conversation: TConversationInfo;
  onClick: () => void;
}
