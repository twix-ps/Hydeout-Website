
import { Button } from '@/components/ui/button';
import Profile from '@/app/components/ui/Profile';

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';

interface SidebarButtonProps {
    name: string;
    route: string;
    tooltip?: string;
    icon: string;
  }
    
  const SidebarButton: React.FC<SidebarButtonProps> = ({ name, route, tooltip, icon, ...props }) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => window.location.href = route} {...props}>
              <span className="material-symbols-outlined text-xl items-center flex justify-center">
                {icon}
              </span>
            </Button>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent side="right" align="end" className="pointer-events-none" sideOffset={8}>
              <p className="text-sm z-50 bg-gray-300 border-gray-200 dark:bg-gray-800 border-2 dark:border-gray-600 pl-2 pr-2 pt-1 pb-1 rounded-lg pointer-events-none">{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };
  

export function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const sidebar = [

    { name: 'Payments', route: '?action=payments', icon: 'payments', tooltip: 'Payments' },
    { name: 'Users', route: '/users', icon: 'people', tooltip: 'Users' },
    { name: 'Leaderboards', route: '?action=leaderboards', icon: 'leaderboard', tooltip: 'Leaderboards' },
    { name: 'Settings', route: '/settings', icon: 'settings', tooltip: 'Settings' },
    { name: 'Help', route: '/help', icon: 'help', tooltip: 'Help' },
]



export default function SidePanel() {
  const { data: session } = useSession()
  const [displayLeaderboard, setDisplayLeaderboard] = React.useState(false)
  const imageUrl = session?.user.image || ""

  return (
    <div className="flex sm:flex-col items-center flex-row sm:p-4 p-2 bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-900 border-[1px]  sm:w-max-[20%] sm:h-screen-[100%] h-min sm:items-center gap-2">
      <Profile />
      

      <div className="flex sm:flex-col flex-row gap-2 items-center justify-between w-full">
        <span className='flex sm:flex-col flex-row gap-2 items-center sm:mt-12'>

          {sidebar.map((item) => (
            <SidebarButton key={item.name} name={item.name} route={item.route} icon={item.icon} tooltip={item.tooltip} />
          ))}
          
        </span>

        <span className='flex flex-col gap-2 items-center'>
            <Button
            variant="outline"
            size="icon"
            onClick={() => signOut()}
            >
                
            <span className="material-symbols-outlined text-xl">
                logout
            </span>
            </Button>
            <ModeToggle />
        </span>

      </div>
    </div>
  )
}