"use client";
import { Client } from "strafe.js";
import { useEffect, useState } from "react";
import { useClient } from "@/context/ClientContext";
import cookie from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";
import GuildList from "@/components/GuildList";
import Chat from "@/components/Chat";

export default function App() {
  const { client, ready, setClient, setReady } = useClient();
  const [position, setPosition] = useState("right");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!client) setClient!(new Client());

    if (client) {
      if (!client.options.token) client.login(cookie.get("token")!);

      client.once("ready", () => {
        setReady!(true);
      });
    }
  }, [client, setClient, setReady]);

  if (!client || !ready) return <LoadingScreen />;

  return (
    <div className={`w-full h-full flex ${(position == "top" || position == "bottom") && "flex-col"}`}>
      {/* {(position === "left" || position == "top" && <GuildList position={position} />)}
      <ChannelList />
      {(position === "right" || position === "bottom") && (
        <GuildList position={position} />
      )} */}
      {((position == "left" || position == "top") && <GuildList orientation={position == "left" ? "horizontal" : "vertical"}/>)}
      <Chat/>
      {((position == "right" || position == "bottom") && <GuildList orientation={position == "right" ? "horizontal" : "vertical"}/>)}
    </div>
  );
}
