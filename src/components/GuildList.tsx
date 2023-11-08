/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";
import { useState, useEffect } from "react";
import UserSettingsModal from "./modals/UserSettingsModal";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { BedDouble, Code2, PencilIcon, PlayCircle } from "lucide-react";

export default function GuildList({ orientation }: { orientation: string }) {
  const { client, status } = useClient();
  // Maybe, I have to move some stuff wait why remove the statusColor
  const [showSettings, setShowSettings] = useState(false);
  const [statusColor, setStatusColor] = useState("");

  // useEffect(() => { //oh uh what do we do for sleeps and coding 
  //    switch (status) { 
  //      case "online":
  //        setStatusColor!("green");
  //        break;
  //      case "offline":
  //        setStatusColor!("gray");
  //        break;
  //      case "idle":
  //        setStatusColor!("yellow");
  //        break;
  //      case "dnd":
  //        setStatusColor!("red");
  //        break;
  //       case "streaming":
  //        setStatusColor!("purple");
  //        break;
  //     default:
  //        setStatusColor!("gray");
  //        break;
  //    }
  // }, [client, status]);

  return (
    <ul className={`guild-sidebar-${orientation}`}>
      <ContextMenu>
        <ContextMenuTrigger className="relative rounded-full hover:bg-stone-800">
          <img src={client?.user?.avatar ? client.user.avatar : ""} className="border border-[#2F3136] w-10 h-10 select-none p-0.5 rounded-full" alt="profile picture" />
          <div className={`w-3 h-3 status-${status} absolute bottom-0 right-0 rounded-full`}></div>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-black">
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
    </ul>
  );
}
