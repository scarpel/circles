import { IComponent } from "@customTypes/common";
import { addConversation } from "@redux/slices/conversationsSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import { createPrivateConversation } from "@services/backend/conversations";
import React from "react";
import { useQuery } from "react-query";

export default function withConversation<TProps>(Component: IComponent) {
  return (props: TProps & { conversationSearchId: string | null }) => {
    // States
    const dispatch = useAppDispatch();
    const conversation = useAppSelector(
      ({ conversations }) =>
        conversations.hashedConversations[props.conversationSearchId!]
    );

    // Query
    const fetchConversation = async () => {
      try {
        if (conversation) return true;

        const { data: newConversation } = await createPrivateConversation(
          props.conversationSearchId!
        );

        if (newConversation) {
          dispatch(addConversation(newConversation));
        }

        return true;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const { isLoading, isError } = useQuery(
      ["conversation", props.conversationSearchId],
      fetchConversation,
      { enabled: !conversation }
    );

    // Render
    return (
      <Component
        conversationPayload={conversation}
        isLoading={isLoading || !conversation}
        hasError={isError}
        {...props}
      />
    );
  };
}
