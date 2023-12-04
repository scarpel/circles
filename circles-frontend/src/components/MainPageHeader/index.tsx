import React from "react";
import { IMainPageHeaderProps } from "./type";
import Image from "next/image";
import Signed from "./components/Signed";
import NotSigned from "./components/NotSigned";

// Assets
import LogoCircle from "@assets/images/logoCircle.png";
import Logo from "@assets/svg/logo.svg";
import Link from "next/link";
import classNames from "classnames";

export default async function MainPageHeader({
  className,
  session,
  showNav = true,
}: IMainPageHeaderProps) {
  // Render
  const renderNav = () => {
    if (!showNav) return null;

    return session?.user ? <Signed user={session.user} /> : <NotSigned />;
  };

  return (
    <header
      className={classNames(
        "flex justify-between items-center sora",
        className
      )}
      style={{ height: 35 }}
    >
      <Link href="/" className="flex">
        <Image src={LogoCircle} alt="Circles" height={35} />
        <Image className="ml-2" src={Logo} alt="Circles" height={30} />
      </Link>

      {renderNav()}
    </header>
  );
}
