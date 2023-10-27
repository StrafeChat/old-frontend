"use client";

import { Client } from "strafe.js";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IClientContext {
  client?: Client;
  ready?: boolean;
  setClient?: Dispatch<SetStateAction<Client | undefined>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
}

const ClientContext = createContext<IClientContext>({});

export const ClientProvider = ({ children }: { children: JSX.Element }) => {
  const [client, setClient] = useState<Client>();
  const [ready, setReady] = useState(false);

  return (
    <ClientContext.Provider value={{ client, ready, setClient, setReady }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
