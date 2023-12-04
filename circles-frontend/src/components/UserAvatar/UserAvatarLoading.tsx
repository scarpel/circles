import React from "react";
import { IUserAvatarLoadingProps } from "./type";

export default function UserAvatarLoading({
  showName = true,
}: IUserAvatarLoadingProps) {
  return (
    <div
      role="status"
      className="max-w-sm animate-pulse flex flex-col justify-center items-center"
    >
      <div className="w-20 h-20 bg-gray-200 rounded-full dark:bg-gray-500"></div>
      {showName ? (
        <div className="w-14 h-3 mt-2 bg-gray-200 rounded-full dark:bg-gray-500"></div>
      ) : null}
      <span className="sr-only">Searching for users...</span>
    </div>
  );
}
