import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DiscordLogoIcon } from "@radix-ui/react-icons"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { signIn, useSession } from "next-auth/react"

export default function Profile() {
    const { data: session } = useSession()
    const name = session?.user.name || ""
    const imageUrl = session?.user.image || ""
  
    if (session) {
      return (
        <Avatar
          className="dark:hover:bg-gray-800 hover:bg-gray-100 hover:cursor-pointer dark:hover:cursor-pointer w-[58px] h-[58px]" 
          onClick={() => window.location.href = "/profile"}
        >
          <AspectRatio ratio={1}>
            <AvatarImage className="rounded-md" src={imageUrl} sizes="100%"/>
          </AspectRatio>
          <AvatarFallback>
            <span className="text-xl">{name}</span>
          </AvatarFallback>
        </Avatar>
      )
    } else {
      return (
        <div className="p-2 border-2 flex rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <DiscordLogoIcon onClick={() => signIn("discord")} width={22} height={22} />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
              <p className="text-sm bg-gray-300 border-gray-200 dark:bg-gray-800 border-2 dark:border-gray-600 pl-2 pr-2 pt-1 pb-1 rounded-lg pointer-events-none">Login with discord</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  }
  