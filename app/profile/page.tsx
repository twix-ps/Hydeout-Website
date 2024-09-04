"use client";

import { getCsrfToken, SessionProvider, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import LoadingPage from "../components/ui/LoadingPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Link, Table, ArrowLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionData {
  user: {
    name: string;
    email: string;
    image: string;
    createdAt: string;
    id: string;
  };
}

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  robux: number;
  won: number;
  lost: number;
  level: number;
  xp: number;
}

async function getProfile(userId: string): Promise<UserInfo> {

  const response = await fetch(`/api/users?id=${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Unknown error occurred');
  }

  return response.json();
}

function ProfileHeader({ userData, loading }: { userData: UserInfo | null; loading: boolean }) {
  return (
    <div className="flex items-center gap-4 justify-between pr-8 pl-8 sm:pl-2 sm:pr-2">
      <span className="flex items-center gap-4">
        {loading ? (
          <Skeleton className="w-16 h-16 rounded-full" />
        ) : (
          <Avatar className="h-16 w-16">
            <AvatarImage src={userData?.avatar} className="w-16 h-16 rounded-full" />
            <AvatarFallback>{userData?.name.charAt(0).toUpperCase()} </AvatarFallback>
          </Avatar>
        )}
        <div className="grid gap-1">
          {loading ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </>
          ) : (
            <>
              <div className="text-xl font-semibold">{userData?.name}</div>
              <div className="text-muted-foreground">@{userData?.id}</div>
            </>
          )}
        </div>
      </span>
      <Button onClick={() => window.history.back()} variant="outline" className="text-sm">
        <span className="flex justify-center items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="font-medium">Return</span>
        </span>
      </Button>
    </div>
  );
}


function ProfileStats({ userData }: { userData: UserInfo }) {
  return (
    <CardContent className="grid gap-4">
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">Level:</span>
        <span>{userData.level}</span>
      </div>
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">Robux:</span>
        <span>{userData.robux}</span>
      </div>
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">XP:</span>
        <span>{userData.xp}</span>
      </div>
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">Won:</span>
        <span>{userData.won}</span>
      </div>
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">Lost:</span>
        <span>{userData.lost}</span>
      </div>
      <Separator />
      <div className="flex justify-between pr-4 pl-4">
        <span className="font-medium text-muted-foreground">Profit:</span>
        <span>{userData.won - userData.lost}</span>
      </div>
    </CardContent>
  );
}


function ProfileSkeleton() {
  return (
    <CardContent className="grid gap-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
    </CardContent>
  );
}


function Profile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (id: string) => {
      try {
        const data = await getProfile(id);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const id = searchParams.get("id") || session?.user?.id;

    if (id) {
      fetchUserData(id);
    } else {
      setLoading(false);
    }
  }, [session, searchParams]);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Suspense fallback={<LoadingPage />}>
        <div className="w-fit max-w-4xl grid gap-6">
          <Card className="p-6 sm:p-2 sm:w-[450px] grid gap-6">
            <ProfileHeader userData={userData} loading={loading} />
            {error && !loading && (
              <div className="text-red-500 bg-yellow-400 rounded animate-pulse">
                <h1 className="font-bold text-lg text-center">{error}</h1>
              </div>
            )}
            {userData && !loading && !error ? <ProfileStats userData={userData} /> : <ProfileSkeleton />}
          </Card>
        </div>
      </Suspense>
    </div>
  );
}




export default function Page() {
  return (
    <SessionProvider>
      <Suspense fallback={<LoadingPage />}>
        <Profile />
      </Suspense>
    </SessionProvider>
  );
}
