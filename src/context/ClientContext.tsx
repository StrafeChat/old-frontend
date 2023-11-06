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
  const [serverListPos, setServerListPos] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    if (!client) {
      const newClient = new Client();
      setClient(newClient);
      newClient.once("ready", () => {
        if (newClient.user) setServerListPos(newClient.user.preferences!.serverListPos);
        setReady(true);
      })
    } else if (!client.options.token) client.login(cookie.get("token")!)
  }, [client, pathname]);

  return (
    <ClientContext.Provider value={{ client, serverListPos, ready, setClient, setReady, setServerListPos }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
