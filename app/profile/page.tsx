"use client"


import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";

interface SessionData {
    user: {
      name: string;
      email: string;
      image: string;
      createdAt: string;
      id: string;
    };
  }
  
  function Profile() {
    const { data: session } = useSession();
  
    if (!session) {
        return (
            <div className="flex flex-col items-center p-4 w-min min-w-[300px] h-min m-4 rounded-lg bg-gray-100 shadow-md animate-pulse">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                <div className="flex flex-col ml-4">
                  <div className="w-32 h-6 bg-gray-300 rounded mt-2"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            </div>
          );
    }
  
    const { user } = session as unknown as SessionData;
  
    return (
      <div className="flex flex-col items-center p-4 w-min min-w-[300px] h-min m-4 rounded-lg bg-gray-100 shadow-md">
        <div className="flex items-center">
          <img src={user.image} alt="Profile" width={64} height={64} className="rounded-full border-[1px]" />
          <div className="flex flex-col ml-4">
            <h1 className="text-2xl font-bold text-black">{user.name}</h1>
            <p className="text-gray-500 text-sm">ID: {user.id}</p>
          </div>
        </div>
      </div>
    );
  }
  

export default function Page() {

    return (
        <SessionProvider>
            <Profile/>
        </SessionProvider>
    );
}