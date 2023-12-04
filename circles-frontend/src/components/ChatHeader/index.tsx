import React from "react";
import { IChatHeader } from "./types";
import { useAppDispatch } from "@redux/store";
import { setfocusedConversationSearchKey } from "@redux/slices/conversationsSlice";

// Icons
import { FiX } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";

export default function ChatHeader({
  SideComponent,
  conversationPayload,
}: IChatHeader) {
  // Hooks
  const dispatch = useAppDispatch();

  // Functions
  const onCloseChat = () => {
    dispatch(setfocusedConversationSearchKey(null));
  };

  // Render
  return (
    <header className="flex items-center justify-between w-full">
      {SideComponent ? (
        <SideComponent conversationPayload={conversationPayload} />
      ) : null}

      <div className="flex items-center ml-auto">
        <button onClick={() => {}}>
          <FiMoreHorizontal className="text-2xl" />
        </button>

        <button onClick={onCloseChat} className="ml-4">
          <FiX className="text-3xl" />
        </button>
      </div>
    </header>
  );
}
