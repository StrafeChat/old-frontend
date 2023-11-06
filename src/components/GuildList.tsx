/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";
import { useState } from "react";
import UserSettingsModal from "./modals/UserSettingsModal";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { BedDouble, Code2, PencilIcon, PlayCircle } from "lucide-react";

export default function GuildList({ orientation }: { orientation: string }) {
  const { client } = useClient();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ul className={`guild-sidebar-${orientation}`}>
      <ContextMenu>
        <ContextMenuTrigger><img src={client?.user?.avatar ? client.user.avatar : ""} className="border border-[#2F3136] w-12 h-12 select-none p-0.5 rounded-lg" alt="profile picture" /></ContextMenuTrigger>
        <ContextMenuContent className="bg-black">
          <ContextMenuItem onClick={() => setShowSettings(true)}>Settings</ContextMenuItem>
          <hr />
          <ContextMenuItem className="flex gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" />Online</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><div className="w-2 h-2 bg-gray-500 rounded-full" />Offline</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full" />Idle</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><div className="w-2 h-2 bg-red-500 rounded-full" />Do Not Disturb</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><Code2 className="w-4 h-4 text-blue-500" />Coding</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><PlayCircle className="w-4 h-4 text-purple-500"/>Streaming</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><BedDouble className="w-4 h-4 text-orange-500" />Sleeping</ContextMenuItem>
          <ContextMenuItem className="flex gap-2"><PencilIcon className="w-4 h-4"/>Custom</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className={`${orientation == "horizontal" ? "w-[45px] h-0.5 my-1" : "w-0.5 h-[45px] mx-1"} bg-gray-200 opacity-30`}></div>
      {showSettings && <UserSettingsModal show={showSettings} set={setShowSettings} />}
    </ul>
  );
}
