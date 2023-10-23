"use client";
import cookie from "js-cookie";
import Client from "@/ws/Client";
import { useEffect, useState } from "react";

export default function App() {
  const [client, setClient] = useState<Client | null>(null);
  const [heartbeatTimer, setHeartbeatTimer] = useState<NodeJS.Timer | null>(
    null
  );

  const startHeartbeat = (heartbeatInterval: number) => {
    setHeartbeatTimer(
      setInterval(() => {
        client?.sendHeartbeat();
      }, heartbeatInterval)
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!client) setClient(new Client("ws://localhost:3001"));

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
