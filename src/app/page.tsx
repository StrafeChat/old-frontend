"use client";
import { Client } from "strafe.js";
import { useEffect, useState } from "react";
import { useClient } from "@/context/ClientContext";
import cookie from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";
import GuildList from "@/components/GuildList";
import ChannelList from "@/components/ChannelList";

export default function App() {
  const { client, ready, setClient, setReady } = useClient();
  const [position, setPosition] = useState("left");

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
    <div className={`w-full h-full flex ${position == "top" && "flex-col"}`}>
      <GuildList position={position}/>
      <ChannelList/>
    </div>
  );
}
