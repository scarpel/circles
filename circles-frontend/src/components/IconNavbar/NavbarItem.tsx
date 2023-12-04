import React from "react";
import classNames from "classnames";
import { INavbarItemProps } from "./types";

export default function NavbarItem({
  className,
  icon: Icon,
  iconFill = "white",
  iconSize = "2rem",
  onClick,
  selected,
}: INavbarItemProps) {
  return (
    <button
      className={classNames("navbar-item flex-center group", className, {
        selected,
      })}
      style={{ width: iconSize, height: iconSize }}
      onClick={onClick}
    >
      <Icon
        stroke={iconFill}
        className="group-hover:scale-125 icon w-full h-full transition-all ease-in-out duration-500"
      />
    </button>
  );
}
