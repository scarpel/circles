import MainPageHeader from "@components/MainPageHeader";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Render
  return (
    <div className="w-full min-h-screen p-8 flex flex-col">
      <MainPageHeader session={session} />

      <main className="flex-grow flex flex-col items-start justify-center">
        <h1 className="text-white font-semibold text-4xl w-2/4">
          Chat with all your <span className="sora text-gradient">circles</span>{" "}
          of friends in just one place
        </h1>

        <Link href="/chat">
          <button className="bg-white mt-10 uppercase tracking-widest px-5 py-4 text-sm rounded-lg sora font-medium">
            Get started
          </button>
        </Link>
      </main>
    </div>
  );
}
