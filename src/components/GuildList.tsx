/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function GuildList({ orientation }: { orientation: string }) {
  const { client } = useClient();

  return (
    <ul className={`guild-sidebar-${orientation}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger><img src={client?.user?.avatar ? client.user.avatar : ""} className="border border-[#2F3136] w-12 h-12 select-none p-0.5" alt="profile picture" /></TooltipTrigger>
          <TooltipContent>
            <p>{client.user.displayName}</p>
            <p>{client.user.username}#{client.user.tag}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <Tooltip></Tooltip> */}
      <div className={`${orientation == "horizontal" ? "w-[45px] h-0.5 my-1" : "w-0.5 h-[45px] mx-1"} bg-gray-200 opacity-30`}></div>
    </ul>
  );
}
