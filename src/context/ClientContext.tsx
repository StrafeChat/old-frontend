"use client";

import { Client, Friend } from "strafe.js";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import cookie from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";
import { PmRoom } from "strafe.js/dist/structures/Room";

interface IClientContext {
  client?: Client;
  pms?: PmRoom[];
  friends?: Friend[];
  ready?: boolean;
  serverListPos?: string;
  status?: string;
  setClient?: Dispatch<SetStateAction<Client | undefined>>;
  setPms?: Dispatch<SetStateAction<PmRoom[]>>;
  setFriends?: Dispatch<SetStateAction<Friend[]>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
  setServerListPos?: Dispatch<SetStateAction<string>>;
  setStatus?: Dispatch<SetStateAction<string>>;
  copyText?: (text: string) => void;
}

const ClientContext = createContext<IClientContext>({});

export const ClientProvider = ({ children }: { children: JSX.Element }) => {
  const pathname = usePathname();
  const [client, setClient] = useState<Client>();
  const [pms, setPms] = useState<any[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [ready, setReady] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [serverListPos, setServerListPos] = useState("");
  const [status, setStatus] = useState("");

  const [copyStr, setCopyStr] = useState("");
  const copyInput = useRef<HTMLInputElement>(null);

  const copyText = (text: string) => {
    console.log(text);
    setCopyStr(text);
    if (copyInput.current) {
      copyInput.current.select();
      copyInput.current.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(text);
    }
  };

  useEffect(() => {
    if (pathname.startsWith("/register") || pathname.startsWith("/login")) return;
    document.addEventListener("contextmenu", (event) => {
      if ((event.target as HTMLElement).id != "chatbox") event.preventDefault();
    });

    if (!client) {
      const newClient = new Client();
      setClient(newClient);
      newClient.on("ready", () => {
        if (newClient.user)
          setServerListPos(newClient.user.preferences!.serverListPos);
        setReady(true);
        setStatus(newClient.user?.status.name!);
        newClient.getFriends().then((friends) => {
          if (friends != null) setFriends(friends);
        });
        newClient.user?.getPMS().then((pms) => {
          setPms(pms);
          console.log(pms);
        });
        setClientError(false);
      });
    } else if (!client.options.token) { 
      client.login(cookie.get("token")!); 
      client.on("error", (err) => {
        if (err.code == 4004) {
          cookie.remove("token");
          window.location.href = "/login";
        }
      });
  } else if (!cookie.get("token")) {
    window.location.href = "/login";
  }
  }, [client, pathname]);

  useEffect(() => {
    if (pathname.startsWith("/signup") || pathname.startsWith("/login")) return;
    client?.on("error", () => {
      setClientError(true);
    });

    client?.on("presenceUpdate", (data) => {
      console.log(data);
      if (data.user.id == client.user!.id) return setStatus(data.status.name);

      setFriends((prevFriends: any[]) => {
        return prevFriends.map((friend) => {
          if (friend.receiverId == data.user.id)
            return {
              ...friend,
              receiver: {
                ...friend.receiver,
                status: {
                  ...friend.receiver.status,
                  name: data.status.name,
                },
              },
            };
          else if (friend.senderId == data.user.id)
            return {
              ...friend,
              sender: {
                ...friend.sender,
                status: {
                  ...friend.sender.status,
                  name: data.status.name,
                },
              },
            };
          return friend;
        });
      });
    });
  }, [client, friends, pathname]);

  if (clientError) return <LoadingScreen />;

  return (
    <ClientContext.Provider
      value={{
        client,
        pms,
        friends,
        serverListPos,
        status,
        ready,
        setClient,
        setPms,
        setFriends,
        setReady,
        setServerListPos,
        setStatus,
        copyText,
      }}
    >
      <input ref={copyInput} readOnly className="hidden" value={copyStr} />
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
