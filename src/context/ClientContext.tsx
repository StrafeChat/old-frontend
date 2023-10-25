"use client";

import Client from "@/ws/Client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IClientContext {
  client?: Client;
  heartbeatTimer?: NodeJS.Timer;
  setClient?: Dispatch<SetStateAction<Client | undefined>>;
  setHeartbeatTimer?: Dispatch<SetStateAction<NodeJS.Timer | undefined>>;
}

const ClientContext = createContext<IClientContext>({});

export const ClientProvider = ({ children }: { children: JSX.Element }) => {
  const [client, setClient] = useState<Client>();
  const [heartbeatTimer, setHeartbeatTimer] = useState<NodeJS.Timer>();

  return (
    <ClientContext.Provider
      value={{ client, heartbeatTimer, setClient, setHeartbeatTimer }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
