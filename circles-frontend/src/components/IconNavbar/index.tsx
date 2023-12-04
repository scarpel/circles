"use client";

import React from "react";
import { INavbarProps } from "./types";
import NavbarItem from "./NavbarItem";
import classNames from "classnames";

export default function IconNavbar({
  onTabSelection,
  tabs = [],
  selectedTab,
  iconFill,
  iconSize,
  className,
}: INavbarProps) {
  // Render
  return (
    <nav className={classNames("flex-col flex-center space-y-12", className)}>
      {tabs.map((tab) => (
        <NavbarItem
          key={tab.id}
          icon={tab.icon}
          onClick={() => {
            onTabSelection(tab.id);
            tab.onSelect && tab.onSelect();
          }}
          selected={selectedTab === tab.id}
          iconFill={iconFill}
          iconSize={iconSize}
        />
      ))}
    </nav>
  );
}
