import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { IUserAvatarProps } from "./type";
import Image from "next/image";

const SizeClasses = {
  sm: {
    avatar: "w-10 h-10",
    avatarGroupHover: "group-hover:translate-y-2.5",
    avatarInitials: "text-lg",
    name: "pt-1 text-xs group-hover:-translate-y-2",
  },
  md: {
    avatar: "w-16 h-16",
    avatarGroupHover: "group-hover:translate-y-2.5",
    avatarInitials: "text-3xl",
    name: "pt-2 text-sm group-hover:-translate-y-3",
  },
  lg: {
    avatar: "w-20 h-20",
    avatarGroupHover: "group-hover:translate-y-2.5",
    avatarInitials: "text-4xl",
    name: "pt-2 text-sm group-hover:-translate-y-3",
  },
  xl: {
    avatar: "w-32 h-32",
    avatarGroupHover: "group-hover:translate-y-2.5",
    avatarInitials: "text-6xl",
    name: "pt-2 text-lg group-hover:-translate-y-3",
  },
};

export default function UserAvatar({
  user,
  showName = true,
  onClick = () => {},
  size = "md",
  pointer = true,
  withAnimation = true,
  className,
}: IUserAvatarProps) {
  // States
  const [showAvatar, setShowAvatar] = useState(() => !!user.avatar);

  const { initials } = useMemo(() => {
    if (!user) return {};

    const splittedName = user.name.split(" ");

    return {
      initials:
        splittedName.length > 1
          ? `${splittedName[0][0]}${splittedName.pop()![0]}`
          : splittedName[0][0],
    };
  }, [user]);

  const { avatar, avatarGroupHover, name, avatarInitials } = useMemo(
    () => SizeClasses[size] || SizeClasses.md,
    [size]
  );

  // Render
  const renderAvatar = () =>
    user.avatar && showAvatar ? (
      <Image
        src={user.avatar}
        alt={user.name}
        className="w-full h-full"
        onError={() => setShowAvatar(false)}
      />
    ) : (
      <h5
        className={classNames("m-0 p-0 text-white font-medium", avatarInitials)}
      >
        {initials}
      </h5>
    );

  return (
    <div
      className={classNames("user-avatar text-center w-fit", {
        "cursor-pointer": pointer,
        group: withAnimation,
      })}
      role="button"
      onClick={onClick}
    >
      <div
        className={classNames(
          "bg-black rounded-full flex-center group-hover:scale-110 group-hover:shadow-xl transition-all ease-in-out duration-300 overflow-hidden",
          avatar,
          className,
          {
            [avatarGroupHover]: showName,
          }
        )}
      >
        {renderAvatar()}
      </div>

      {showName ? (
        <p
          className={classNames(
            "m-0 p-0 group-hover:opacity-0 transition-all ease-in-out duration-300 font-medium",
            name
          )}
        >
          {user.username}
        </p>
      ) : null}
    </div>
  );
}
