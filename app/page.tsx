"use client"
import {Suspense} from "react";
import Payments from "./components/ui/Payments";
import SidePanel from "./components/ui/SidePanel";
import {SessionProvider} from 'next-auth/react'
import { useSearchParams } from "next/navigation";
import Leaderboard from "./components/ui/Leaderboard";


function Page() {
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

function Loading() {
  return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
  )
}

export default function Home() {

  return (
    <SessionProvider>
      <Suspense fallback={<Loading />}>
        <Page/>
      </Suspense>
    </SessionProvider>

  );
}