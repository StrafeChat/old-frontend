"use client";
import { useClient } from "@/context/ClientContext";
import LoadingScreen from "./LoadingScreen";
import GuildList from "./GuildList";
import RoomList from "./RoomList";

export default function Layout({ children }: { children: JSX.Element[] | JSX.Element }) {
    const { client, ready, serverListPos } = useClient();

    if (!client || !ready) return <LoadingScreen />;

    return (
        <div className={`w-full h-full flex border-b border-gray-900 ${(serverListPos == "top" || serverListPos == "bottom") && "flex-col"}`}>
            {((serverListPos == "left" || serverListPos == "top") && <GuildList orientation={serverListPos == "left" ? "horizontal" : "vertical"} />)}
            <div className="w-full h-full flex">
                <RoomList />
                <div className="app-wrapper">
                    {children}
                </div>
            </div>
            {((serverListPos == "right" || serverListPos == "bottom") && <GuildList orientation={serverListPos == "right" ? "horizontal" : "vertical"} />)}
        </div>)
}