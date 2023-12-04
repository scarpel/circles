"use client";

import React, { useMemo, useState } from "react";
import { ChatNavbarTabs, IChatNavbarProps } from "./types";

// Icons
import { FiHome } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { TNavbarTab } from "@components/IconNavbar/types";
import IconNavbar from "@components/IconNavbar";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import UserAvatar from "@components/UserAvatar";

export default function ChatNavbar({ user, className }: IChatNavbarProps) {
  // States
  const [selectedTab, setSelectedTab] = useState(ChatNavbarTabs.HOME);

  const tabs = useMemo(
    () =>
      [
        {
          id: ChatNavbarTabs.HOME,
          icon: FiHome,
        },
        {
          id: ChatNavbarTabs.CONFIG,
          icon: FiSettings,
        },
        {
          id: ChatNavbarTabs.LEAVE,
          icon: FiLogOut,
          onSelect: () => signOut({ callbackUrl: "/" }),
        },
      ] as TNavbarTab[],
    []
  );

  // Render
  return (
    <section
      className={classNames(
        "h-full flex flex-col justify-between items-center",
        className
      )}
    >
      <div />

      <IconNavbar
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelection={(tab) => setSelectedTab(tab as any)}
      />

      <div className="relative">
        <div className="absolute w-5 h-5 bg-gradient-to-r from-green-400 to-green-600 rounded-full -right-1 top-0" />

        <UserAvatar
          className="border-white border-2"
          user={user}
          showName={false}
          size="md"
          withAnimation={false}
        />
      </div>
    </section>
  );
}
