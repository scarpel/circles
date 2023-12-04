import { IComponent, TIconProps } from "@customTypes/common";

export interface INavbarItemProps {
  icon: IComponent<TIconProps>;
  iconSize?: TIconProps["width"];
  iconFill?: TIconProps["fill"];
  className?: string;
  onClick: () => void;
  selected?: boolean;
}

export type TNavbarTab = {
  icon: IComponent<TIconProps>;
  id: string;
  onSelect?: () => void;
};

export interface INavbarProps
  extends Pick<INavbarItemProps, "iconSize" | "iconFill"> {
  onTabSelection: (tab: string) => void;
  tabs: TNavbarTab[];
  className?: string;
  selectedTab?: string;
}
