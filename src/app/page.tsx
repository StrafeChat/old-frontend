"use client";
import cookie from "js-cookie";
import Client from "@/ws/Client";
import { useEffect } from "react";
import { useClient } from "@/context/ClientContext";

export default function App() {
  const { client, setClient, setHeartbeatTimer } = useClient();

  const startHeartbeat = (heartbeatInterval: number) => {
    setHeartbeatTimer!(
      setInterval(() => {
        client?.sendHeartbeat();
      }, heartbeatInterval)
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!client) setClient!(new Client(process.env.NEXT_PUBLIC_WS_URI!));

    client?.addEventListener("open", () => {
      console.log("Connected to the websocket server!");
      client?.send(
        JSON.stringify({
          op: 2,
          data: {
            token: cookie.get("token"),
          },
        })
      );
    });

    client?.addEventListener("message", (res: any) => {
      const { op, data } = JSON.parse(res.data);
      switch (op) {
        case 9:
          const { heartbeatInterval } = data;
          startHeartbeat(heartbeatInterval);
          break;
      }
    });

    client?.addEventListener("close", (event) => {
      switch (event.code) {
        case 4004:
          window.location.href = "/login";
          break;
      }
    });
  });

  return <div></div>;
}
