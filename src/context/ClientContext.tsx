"use client";

import { Client } from "strafe.js";
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
  ready?: boolean;
  serverListPos?: string;
  setClient?: Dispatch<SetStateAction<Client | undefined>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
  setServerListPos?: Dispatch<SetStateAction<string>>
}

const ClientContext = createContext<IClientContext>({});

export const ClientProvider = ({ children }: { children: JSX.Element }) => {
  const pathname = usePathname();
  const [client, setClient] = useState<Client>();
  const [ready, setReady] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [serverListPos, setServerListPos] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    if (!client) {
      const newClient = new Client();
      setClient(newClient);
      newClient.on("ready", () => {
        if (newClient.user) setServerListPos(newClient.user.preferences!.serverListPos);
        setReady(true);
        setClientError(false);
      })
    } else if (!client.options.token) client.login(cookie.get("token")!)
  }, [client, pathname]);

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    client?.on("error", () => {
       setClientError(true);
    })
  }, [client])

  if (clientError) return <LoadingScreen />
   
  return (
    <ClientContext.Provider value={{ client, serverListPos, ready, setClient, setReady, setServerListPos }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
