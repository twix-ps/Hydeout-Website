"use client"
import {Suspense} from "react";
import Payments from "./components/ui/Payments";
import SidePanel from "./components/ui/SidePanel";
import {SessionProvider} from 'next-auth/react'
import { useSearchParams } from "next/navigation";
import Leaderboard from "./components/ui/Leaderboard";
import LoadingPage from "./components/ui/LoadingPage";


function Page() {
  const urlParams = useSearchParams();

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <SidePanel 
      />
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
      <Suspense fallback={<LoadingPage />}>
        <Page/>
      </Suspense>
    </SessionProvider>

  );
}