"use client";

import { Client, Friend } from "strafe.js";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from 'next/navigation'
import cookie from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";

interface IClientContext {
  client?: Client;
  friends?: Friend[],
  ready?: boolean;
  serverListPos?: string;
  status?: string;
  setClient?: Dispatch<SetStateAction<Client | undefined>>;
  setFriends?: Dispatch<SetStateAction<Friend[]>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
  setServerListPos?: Dispatch<SetStateAction<string>>;
  setStatus?: Dispatch<SetStateAction<string>>;
}

const ClientContext = createContext<IClientContext>({});

export const ClientProvider = ({ children }: { children: JSX.Element }) => {
  const pathname = usePathname();
  const [client, setClient] = useState<Client>();
  const [friends, setFriends] = useState<Friend[]>([])
  const [ready, setReady] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [serverListPos, setServerListPos] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    if (!client) {
      const newClient = new Client();
      setClient(newClient);
      newClient.on("ready", () => {
        if (newClient.user) setServerListPos(newClient.user.preferences!.serverListPos);
        setReady(true);
        setStatus(newClient.user?.status.name!);
        newClient.getFriends().then((friends) => {
          if (friends != null) setFriends(friends);
        });
        setClientError(false);
      });
    } else if (!client.options.token) client.login(cookie.get("token")!)
  }, [client, pathname]);

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    client?.on("error", () => {
      setClientError(true);
    })

    client?.on("presenceUpdate", (data) => {
      setStatus(data);
    })
  }, [client])

  if (clientError) return <LoadingScreen />

  return (
    <ClientContext.Provider value={{ client, friends, serverListPos, status, ready, setClient, setFriends, setReady, setServerListPos, setStatus }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
