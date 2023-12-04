import React from "react";
import { IMainPageBaseProps } from "./types";
import MainPageHeader from "@components/MainPageHeader";

export default function MainPageBase({ children }: IMainPageBaseProps) {
  return (
    <div className="min-h-screen flex flex-col p-8">
      <MainPageHeader className="flex-shrink-0" showNav={false} />

      <main className="h-full flex-center flex-grow py-10">{children}</main>
    </div>
  );
}
