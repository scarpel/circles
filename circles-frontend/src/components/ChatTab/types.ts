import { ICommonComponentProps } from "@customTypes/common";
import { TConversationInfo, TMessageBlock } from "@customTypes/conversations";

export interface IChatTabProps extends ICommonComponentProps {
  conversationSearchId: string;
  conversationPayload?: TConversationInfo;
  hasError?: boolean;
  isLoading?: boolean;
}

export interface IChatProps {
  conversationPayload: TConversationInfo;
  sendMessage: (message: string) => void;
}

export interface IChatItemProps extends IChatProps {
  messageBlocks: TMessageBlock[];
}
