"use client"
import {useState, useEffect, useRef} from "react";
import Payments from "./components/ui/Payments";
import SidePanel from "./components/ui/SidePanel";
import {SessionProvider} from 'next-auth/react'
import type {AppProps} from 'next/app'
import { Button } from "@radix-ui/themes";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import {signIn, signOut, useSession} from 'next-auth/react'
import { usePathname, useSearchParams } from "next/navigation";
import Leaderboard from "./components/ui/Leaderboard";


function Page() {
  const { data: session } = useSession();
  const currentPath = usePathname();
  const urlParams = useSearchParams();

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <SidePanel />
      {urlParams.get("action") == "payments" && (
        <Payments pageNumber={0} amount={10} paymentsData={[]} />
      )}
      <Leaderboard />
    </div>
  );
}
export default function Home() {

  return (
    <SessionProvider>
      <Page/>
    </SessionProvider>

  );
}