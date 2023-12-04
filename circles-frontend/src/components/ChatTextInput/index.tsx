import React, { useEffect, useRef, useState } from "react";
import { IChatTextInputProps } from "./types";

// Icons
import { FiSend } from "react-icons/fi";
import classNames from "classnames";

export default function ChatTextInput({
  value,
  onChange,
  preventLineBreakOnEnter = true,
  onSend,
  className,
}: IChatTextInputProps) {
  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mockInputRef = useRef<HTMLParagraphElement>(null);
  const lastKeyRef =
    useRef<
      Pick<React.KeyboardEvent<HTMLTextAreaElement>, "key" | "shiftKey">
    >();

  // States
  const [isFocused, setIsFocused] = useState(false);

  // Effects
  useEffect(() => {
    if (inputRef.current && mockInputRef.current) {
      inputRef.current.style.height = `${mockInputRef.current.clientHeight}px`;
    }
  }, [value]);

  // Functions
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (
      preventLineBreakOnEnter &&
      lastKeyRef.current?.key === "Enter" &&
      !lastKeyRef.current?.shiftKey
    )
      return onSend();

    onChange(e.target.value, e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    lastKeyRef.current = e;
  };

  const onFocus = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  // Render
  return (
    <div
      className={classNames(
        "chat-text-input-container relative m-0 p-0 h-fit w-full flex items-center rounded-3xl px-4 py-3 bg-inputGray cursor-text border-2 transition-all ease-in-out",
        className,
        {
          "border-black": isFocused,
        }
      )}
      onClick={onFocus}
    >
      <div className="relative flex-grow h-fit min-w-0">
        <textarea
          className={classNames(
            "chat-text-input text-input transition-all ease-in-out align-top w-full appearance-none resize-none m-0 break-words border-none focus:border-none focus:outline-none outline-none"
          )}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <p
          ref={mockInputRef}
          className={classNames(
            "absolute top-0 left-0 right-0 m-0 p-0 pointer-events-none max-h-36 whitespace-normal invisible appearance-none break-words"
          )}
        >
          {value || "placeholder"}
        </p>
      </div>

      <button className="ml-3" onClick={onSend}>
        <FiSend className="text-xl" />
      </button>
    </div>
  );
}
