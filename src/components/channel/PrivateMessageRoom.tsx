"use client";
import { useEffect, useRef, useState } from "react";
import { PmRoom } from "strafe.js";
import Header from "../Header";
import UserProfileModal from '../modals/UserProfileModal';
import { useClient } from "@/context/ClientContext";
import Message from "../message/Message";
import ChatBox from "./ChatBox";
import Image from "next/image";
import ReactTimeago from "react-timeago";
import { PlusCircle } from "lucide-react";

export default function PrivateMessageRoom({ room }: { room: PmRoom }) {
  const [messages, setMessages] = useState<any[]>([]);
  const { client } = useClient();
  const scrollRef = useRef<HTMLUListElement>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<object | null>(null);

  const openProfileModal = (user: object) => {
    setSelectedUser(user);
    setShowProfileModal(!showProfileModal);
  }

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
            audio.volume = 0.25;
            audio.play();
          }
        }
      }
    });

    return () => {
      client?.off("messageCreate", () => { });
      client?.off("typingUpdate", () => { });
    };
  }, [client, messages, room]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const recipient = room.recipients.find(
    (recipient) => recipient.id != client?.user!.id
  );

  const getFormattedDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();

    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    ) {
      return 'today';
    } else {
      return messageDate.toLocaleDateString('en-US', { year: "numeric", weekday: "long", month: "long", day: "numeric" });
    }
  };


  return (
    <div className="h-full">
      <Header>
        <span>@{recipient?.displayName ?? recipient?.username}</span>
      </Header>
      <div className="flex min-w-[5px] h-full flex-col pb-[55px] justify-end">
        <ul ref={scrollRef} className="overflow-y-auto w-full flex flex-col scrollbar-thin scrollbar-thumb-[#737d3c] scrollbar-thumb-rounded-full scrollbar-track-transparent relative break-all">

        <div className="pt-[25px] pl-[15px] ">
              <h1>
                <b>
                  @
                  {room?.recipients.find(
                    (recipient) => recipient.id != client?.user!.id
                  )?.displayName ||
                    room?.recipients.find(
                      (recipient) => recipient.id != client?.user!.id
                    )?.username}
                </b>
              </h1>
              <p>This is the start of your conversation</p>
            </div>

            {(() => {
               if (messages[0]) return (
                <div className="flex mt-6 mb-2 ml-3 mr-3 relative left-auto right-auto h-0 z-1 border-[0.1px] border-gray-500 items-center justify-center box-border">
              <time className="bg-[#262626] px-4 text-sm text-gray-400 select-none font-bold uppercase">
              { Intl.DateTimeFormat(client?.user?.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(messages[0].createdAt)) }
              </time>
            </div>
               )
            })()}

          {messages.map((message, key) => (
            <>
              {key > 0 && (
                <>
                  {(() => {
                    const messageDate = new Date(message.createdAt);
                    const lastMessageDate = new Date(messages[key - 1].createdAt);

                    if (`${messageDate.getMonth()}/${messageDate.getDate()}/${messageDate.getFullYear()}` != `${lastMessageDate.getMonth()}/${lastMessageDate.getDate()}/${lastMessageDate.getFullYear()}`) return (
                      <div className="flex mt-6 mb-2 ml-3 mr-3 relative left-auto right-auto h-0 z-1 border-[0.1px] border-gray-500 items-center justify-center box-border">
                        <time className="bg-[#262626] px-4 text-sm text-gray-400 select-none font-bold uppercase">{Intl.DateTimeFormat(client?.user?.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(message.createdAt))}</time>
                      </div>
                    )
                  })()}
                </>
              )}
              <Message
                key={key}
                sameAuthor={
                  key > 0 &&
                  message.author.id === messages[key - 1].author.id &&
                  (() => {
                    const messageDate = new Date(message.createdAt);
                    const lastMessageDate = new Date(messages[key - 1].createdAt);
                    return `${messageDate.getMonth()}/${messageDate.getDate()}/${messageDate.getFullYear()}` === `${lastMessageDate.getMonth()}/${lastMessageDate.getDate()}/${lastMessageDate.getFullYear()}`;
                  })()
                }
                message={message}
              />
            </>
          ))}
          <div className="w-full mt-4"></div>
        </ul>
        <ChatBox room={room} />
        {showProfileModal && (
            <UserProfileModal
              show={true}
              set={setShowProfileModal}
              user={selectedUser}
            />
          )}
      </div>
    </div>
  );
}
