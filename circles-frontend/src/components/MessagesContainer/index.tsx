import React, { useEffect, useRef, useState } from "react";
import { IMessagesContainerProps } from "./types";
import classNames from "classnames";

// Icons
import { FiArrowDown } from "react-icons/fi";

export default function MessagesContainer({
  children,
  className,
  messages,
  arrowOffset = 200,
  contentClassName,
}: IMessagesContainerProps) {
  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasInitialized = useRef(false);

  // States
  const [showArrow, setShowArrow] = useState(false);

  // Effects
  useEffect(() => {
    if (!showArrow) {
      scrollToBottom(wasInitialized.current ? "smooth" : "instant");
    }

    if (!wasInitialized.current) wasInitialized.current = true;
  }, [messages]);

  // Functions
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({
      behavior,
    });
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const scrollY =
      e.currentTarget.scrollHeight -
      e.currentTarget.clientHeight -
      e.currentTarget.scrollTop;

    const shouldShowArrow = scrollY >= arrowOffset;

    if (shouldShowArrow !== showArrow) setShowArrow(shouldShowArrow);
  };

  // Render
  return (
    <div
      className={classNames("messages-container min-h-0 relative", className)}
    >
      <section
        className={classNames(
          "space-y-3 overflow-scroll min-h-0 max-h-full",
          contentClassName
        )}
        onScroll={onScroll}
      >
        {children}

        <div ref={bottomRef} />
      </section>

      <button
        className={classNames(
          "absolute w-10 h-10 bg-black left-0 right-0 mx-auto rounded-full flex-center transition-all ease-in-out",
          showArrow
            ? "bottom-0 opacity-1"
            : "-bottom-5 opacity-0 pointer-events-none"
        )}
        onClick={() => scrollToBottom()}
      >
        <FiArrowDown className="text-white text-xl" />
      </button>
    </div>
  );
}
