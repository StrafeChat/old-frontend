/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";
import { useState, useEffect } from "react";
import UserSettingsModal from "./modals/UserSettingsModal";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { BedDouble, Code2, PencilIcon, PlayCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCompass } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";

export default function GuildList({ orientation }: { orientation: string }) {
  const { client, status } = useClient();
  const [showSettings, setShowSettings] = useState(false);
  const [statusColor, setStatusColor] = useState("");

  return (
    <ul className={`guild-sidebar-${orientation}`}>
      <ContextMenu>
        <ContextMenuTrigger className="relative rounded-full hover:bg-stone-800">
          <img src={client?.user?.avatar ? client.user.avatar : ""} className="border border-[#2F3136] w-10 h-10 select-none p-0.5 rounded-full" alt="profile picture" />
          <div className={`w-3 h-3 status-${status} absolute bottom-0 right-0 border border-[#2F3136] rounded-full`}></div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowSettings(true)}>Settings</ContextMenuItem>
          <hr />
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("online")}><div className="w-2 h-2 bg-green-500 rounded-full" />Online</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("offline")}><div className="w-2 h-2 bg-gray-500 rounded-full" />Offline</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("idle")}><div className="w-2 h-2 bg-yellow-500 rounded-full" />Idle</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("dnd")}><div className="w-2 h-2 bg-red-500 rounded-full" />Do Not Disturb</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("coding")}><Code2 className="w-4 h-4 text-blue-500" />Coding</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("streaming")}><PlayCircle className="w-4 h-4 text-purple-500" />Streaming</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("sleeping")}><BedDouble className="w-4 h-4 text-orange-500" />Sleeping</ContextMenuItem>
          <ContextMenuItem className="flex gap-2" onClick={() => client?.user?.setStatus("custom")}><PencilIcon className="w-4 h-4" />Custom</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className={`${orientation == "horizontal" ? "w-[35px] h-0.5 my-1.5" : "w-0.5 h-[35px] mx-1"} bg-gray-200 opacity-30`}></div>
      {showSettings && <UserSettingsModal show={showSettings} set={setShowSettings} />}

    {/** Spaces */}

      <Link href="/"> {/* Make this trigger a modal to create a space*/}
      <div className="bg-[#1c1c1c] w-10 h-10 rounded-full flex items-center justify-center my-[3px]" title="Add Space">
      <FontAwesomeIcon icon={faPlus} className="w-7 h-7 text-[#737d3c]" />
      </div>
      </Link>
      <Link href="/discover"> {/* Make this trigger a modal to create a space*/}
      <div className="bg-[#1c1c1c] w-10 h-10 rounded-full flex items-center justify-center my-[3px]" title="View Discover">
      <FontAwesomeIcon icon={faCompass} className="w-7 h-7 text-[#737d3c]" />
      </div>
      </Link>
    </ul>
  );
}
