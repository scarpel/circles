import { TUser } from "@customTypes/auth";
import { IComponent, TIconProps } from "@customTypes/common";

export interface IChatNavbarProps {
  user: TUser;
  className?: string;
}

export interface IChatNavbarItemProps {
  icon: IComponent<TIconProps>;
  iconSize?: TIconProps["width"];
  iconFill?: TIconProps["fill"];
  className?: string;
  onClick: () => void;
  selected?: boolean;
}

export enum ChatNavbarTabs {
  HOME = "HOME",
  CONFIG = "CONFIG",
  LEAVE = "LEAVE",
}
