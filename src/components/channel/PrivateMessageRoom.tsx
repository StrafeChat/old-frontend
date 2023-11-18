"use client";
import { useEffect, useState } from "react";
import { PmRoom } from "strafe.js";
import Header from "../Header";
import { useClient } from "@/context/ClientContext";
import Message from "../message/Message";
import ChatBox from "./ChatBox";

export default function PrivateMessageRoom({ room }: { room: PmRoom }) {
  const [messages, setMessages] = useState<any[]>([]);
  const { client } = useClient();

  useEffect(() => {
    
    room.fetchMessages(1).then((data) => {
      if (data.code == 200) setMessages([...data.data])
    })

    return () => {
      setMessages([]);
    };
  }, [room]);

  useEffect(() => {
    client?.on("messageCreate", (message) => {
      if (message.roomId == room.id) {
        message.attachments = [];
        setMessages([...messages, message]);
        console.log(message.author.id, client.user!.id);
        if (message.author.id !== client.user!.id) {
          if (client.user?.status.name == "dnd") return;
          if (typeof window !== "undefined" && !document.hasFocus()) {
            const audio = new Audio("http://localhost:3000/ping.mp3");
            audio.volume = 0.5;
            audio.play();
          }
        }
      }
    });

    return () => {
      client?.off("messageCreate", () => {});
      client?.off("typingUpdate", () => {});
    };
  }, [client, messages, room]);

  const recipient = room.recipients.find(
    (recipient) => recipient.id != client?.user!.id
  );

  return (
    <>
      <Header>
        <span>{recipient?.displayName || recipient?.username}</span>
      </Header>
      <main className="!p-0">
        <ul className="messages h-[100%] scrollbar-thin w-full">
          {messages.map((message, key) => {
            const lastMessage = key > 0 ? messages[key - 1] : null;
            return <Message message={message} sameAuthor={lastMessage?.author.id == message.author.id} key={key}/>
          })}
        </ul>
        <ChatBox room={room}/>
      </main>
    </>
  );
}
