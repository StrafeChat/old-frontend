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
  const [client, setClient] = useState<Client>();
  const [ready, setReady] = useState(false);
  const [serverListPos, setServerListPos] = useState("");

  useEffect(() => {
    if (!client) setClient!(new Client());

    if (client) {
      if (!client.options.token) client.login(cookie.get("token")!);

      client.once("ready", () => {
        if (client.user) setServerListPos(client.user.preferences!.serverListPos);
        setReady!(true);
      });
    }
  }, [client, setClient, setReady]);

  return (
    <ClientContext.Provider value={{ client, serverListPos, ready, setClient, setReady, setServerListPos }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
