"use client"
import {Suspense} from "react";
import Payments from "./components/ui/Payments";
import SidePanel from "./components/ui/SidePanel";
import {SessionProvider, signIn, useSession} from 'next-auth/react'
import { useSearchParams } from "next/navigation";
import Leaderboard from "./components/ui/Leaderboard";
import LoadingPage from "./components/ui/LoadingPage";
import NavBar from "./components/ui/NavBar";
import { sign } from "crypto";


function Page() {
  const urlParams = useSearchParams();

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <NavBar />
      <span className="flex flex-col sm:flex-row gap-4">
        <SidePanel 
        />
        {urlParams.get("action") == "payments" && (
          <Payments pageNumber={0} amount={10} paymentsData={[]} />
        )}
        <Leaderboard />
      </span>

    </div>
  );
}

export default function Home() {

  return (
    <SessionProvider>
      <Suspense fallback={<LoadingPage />}>
        <Page/>
      </Suspense>
    </SessionProvider>

  );
}