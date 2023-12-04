import React from "react";
import { IUserImageProps } from "./types";
import Image from "next/image";

export default function UserImage({
  src,
  alt,
  isOnline = true,
  size = 50,
  onlineSize = 18,
}: IUserImageProps) {
  // Render
  const renderOnline = () => (
    <div
      className="online absolute rounded-full bg-green-500 -right-1 -top-1"
      style={{ width: onlineSize, height: onlineSize }}
    />
  );

  return (
    <div
      className="user-image relative rounded-full border-2 cursor-pointer hover:scale-125 transition-all ease-in-out duration-500"
      style={{ width: size, height: size }}
      role="button"
    >
      {isOnline ? renderOnline() : null}

      <Image
        className="w-full h-full rounded-full"
        src={src}
        alt={alt}
        width={size}
        height={size}
      />
    </div>
  );
}
