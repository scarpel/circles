import type { Metadata } from "next";
import Providers from "./Providers";
import { Poppins, Sora } from "next/font/google";
import "./globals.css";
import classNames from "classnames";

import Favicon from "./favicon.ico";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const sora = Sora({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Circles",
  description: "Chat with all your circles of friends in just one place",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-w-full min-h-full bg-black">
      <body className={classNames(sora.variable, poppins.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
