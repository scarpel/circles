"use client";

import React, { useCallback, useRef, useState } from "react";
import { IComponent, TIconProps } from "@customTypes/common";
import classNames from "classnames";

interface ISearchInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
  Icon?: IComponent<TIconProps>;
  iconFill?: string;
  placeholder?: string;
  fontSize?: number | string;
  className?: string;
  name?: string;
  boxClassName?: string;
}

export default function TextInput({
  value,
  onChange = () => {},
  Icon,
  iconFill = "black",
  placeholder,
  fontSize = "1em",
  className,
  boxClassName,
  name,
  ...props
}: ISearchInputProps) {
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // States
  const [isFocused, setIsFocused] = useState(false);

  // Functions
  const onClick = useCallback(() => {
    inputRef.current?.focus();
    setIsFocused(true);
  }, []);

  // Render
  return (
    <div
      className={classNames(
        "text-input flex bg-inputGray border border-darkerInputGray min-w-1 items-center rounded-full p-3 cursor-text transition-all ease-in-out",
        className,
        boxClassName,
        {
          "border-black": isFocused,
        }
      )}
      onClick={onClick}
      onFocus={onClick}
    >
      {Icon ? (
        <Icon className="flex-shrink-0" size={fontSize} stroke={iconFill} />
      ) : null}

      <input
        type="text"
        name={name}
        className={classNames(
          "bg-transparent flex-grow m-0 p-0 pl-3 focus:border-none focus:outline-none pointer-events-none flex-shrink min-w-0",
          boxClassName
        )}
        placeholder={placeholder}
        style={{ fontSize }}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  );
}
