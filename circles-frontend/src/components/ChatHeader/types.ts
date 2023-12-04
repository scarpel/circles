import { IComponent } from "@customTypes/common";
import { TConversationPayload } from "@customTypes/conversations";

export interface IChatHeaderSideComponentProps {
  conversationPayload: TConversationPayload;
}

export interface IChatHeader {
  conversationPayload: TConversationPayload;
  SideComponent?: IComponent<IChatHeaderSideComponentProps>;
}
