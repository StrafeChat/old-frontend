"use client";
import Layout from "@/components/Layout";
import { useClient } from "@/context/ClientContext";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Smile, ScanSearch } from "lucide-react";
import Image from "next/image";
import { PmRoom } from "strafe.js/dist/structures/Room";
import TimeAgo from "react-timeago";

export default function Room({ params }: { params: { id: string } }) {
  const { client, pms, playPing } = useClient();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [emoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [room, setRoom] = useState<PmRoom | null>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      console.log(scrollContainerRef.current!.scrollHeight);
      setShowScrollButton(
        scrollContainerRef.current!.scrollHeight / 1.5 >
          scrollContainerRef.current!.scrollTop &&
          scrollContainerRef.current!.scrollHeight > 3000
      );
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", (event) =>
        handleScroll(event)
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef.current]);

  useEffect(() => {
    setRoom(pms?.find((pm) => pm.id == params.id)!);
  }, [params.id, pms, room]);

  useEffect(() => {
    room?.fetchMessages().then(({ data }) => {
      setMessages([...data]);
    });
  }, [room]);

  useEffect(() => {
    client?.on("messageCreate", (message) => {
      if (message.roomId == params.id) {
        setMessages([...messages, message]);
        if (message.author.id !== client.user!.id) {
          if (client.user?.status.name == "dnd") return;
          if (typeof window !== "undefined") {
            const audio = new Audio("http://localhost:3000/ping.mp3");
              if (!document.hasFocus()) {
                audio.play();
              }
          }
        }
      }
    });

    return () => {
      client?.off("messageCreate", () => {});
      client?.off("typingUpdate", () => {});
    };
  }, [client, messages, params]);

  useEffect(() => {
    client?.on("typingUpdate", (data) => {
      if (!typing.includes(data.username)) {
        console.log(room?.id, data.roomId);
        if (data.roomId != params.id) return;
        setTyping([...typing, data.username]);

        setTimeout(() => {
          setTyping(() =>
            typing.filter((type) => type != client.user?.username)
          );
        }, 5000);
      }
    });
  }, [client, room, params, typing]);

  useEffect(() => {
    if (scrollContainerRef.current)
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
      if (!typing.includes(client?.user?.username!)) room?.sendTyping();
      else
        setTimeout(() => {
          room?.sendTyping();
        }, 10000);
    } else if (typing.includes(client?.user?.username!))
      setTyping(typing.filter((type) => type != client?.user?.username));

    return () => {
      clearInterval(typingInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, room]);

  return (
    <Layout>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-12 rounded-b-lg bg-neutral-900 flex justify-between px-4 items-center font-bold">
          <div className="flex gap-2 items-center">
            <span className="select-none">
              @
              {room?.recipients.find(
                (recipient) => recipient.id != client?.user!.id
              )?.displayName ||
                room?.recipients.find(
                  (recipient) => recipient.id != client?.user!.id
                )?.username}
            </span>
          </div>
        </div>
        <div
          className={`h-[calc(100%-104px)] w-full flex flex-col justify-end pl-[10px] pb-[20px]`}
        >
          {showScrollButton && (
            <button
              className="absolute right-10 bottom-15 cursor-pointer z-[999]"
              onClick={() => {
                if (scrollContainerRef.current)
                  scrollContainerRef.current.scrollTop =
                    scrollContainerRef.current.scrollHeight;
              }}
            >
              DOWN
            </button>
          )}

          <ul
            className="w-full h-fit flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-thumb-rounded-full scrollbar-track-transparent relative"
            ref={scrollContainerRef}
          >
            {messages.map((message, index) => {
              if (index > 0) {
                console.log(client?.user?.id);
                if (messages[index - 1].author.id == message.author.id)
                  return (
                    <li className="flex gap-2.5">
                      <div className="w-8 flex-shrink-0"></div>
                      <span className="text-sm">{message.content}</span>
                    </li>
                  );
                else
                  return (
                    <li key={index} className="flex gap-2.5 pt-4">
                      <div className="w-8 h-8 flex-shrink-0">
                        <Image
                          src={message.author.avatar}
                          width={42}
                          height={42}
                          alt="profile"
                          className="rounded-full select-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-1 mt-[-8px]">
                          <span>
                            <b>
                              {message.author.displayName ||
                                message.author.username}
                            </b>
                            &nbsp;
                            <TimeAgo
                              className="text-gray-400 text-xs"
                              date={message.createdAt}
                            />
                          </span>
                        </div>
                        <span className="text-sm">{message.content}</span>
                      </div>
                    </li>
                  );
              } else {
                return (
                  <li key={index} className="flex gap-2.5 pt-2">
                    <div className="w-8 h-8 flex-shrink-0">
                      <Image
                        src={message.author.avatar}
                        width={42}
                        height={42}
                        alt="profile"
                        className="rounded-full select-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-1 mt-[-8px]">
                        <span>
                          <b>
                            {message.author.displayName ||
                              message.author.username}
                          </b>
                          &nbsp;
                          <TimeAgo
                            className="text-gray-400 text-xs"
                            date={message.createdAt}
                          />
                        </span>
                      </div>
                      <span className="text-sm">{message.content}</span>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>

        {typing.filter((type) => type != client?.user?.username).length > 0 && (
          <div className="w-full h-4 pl-[20px] py-[10px] bg-black flex items-center">
            {typing.filter((type) => type != client?.user?.username).join(", ")}{" "}
            is typing...
          </div>
        )}

        {emoji && <div></div>}

        <div className="w-full h-14 bg-black flex flex-row px-3 items-center">
          <div
            className="items-center justify-between flex flex-row px-4"
            style={{
              backgroundColor: "#171717",
              width: "5%",
              borderRadius: "4px 0px 0px 4px",
              height: "65%",
            }}
          >
            <ImagePlus
              onClick={() => {}}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
          </div>
          <textarea
          className="placeholder:select-none"
            id="chatbox"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setIsTyping(event.target.value.trim() !== "");
            }}
            placeholder={`Send a message to @${
              room?.recipients.find(
                (recipient) => recipient.id != client?.user!.id
              )?.displayName ||
              room?.recipients.find(
                (recipient) => recipient.id != client?.user!.id
              )?.username
            }`}
            onKeyUp={(event) => {
              if (event.key == "Enter" && !event.shiftKey) {
                event?.preventDefault();
                room!.send!(content);
                setContent("");
              }
            }}
            spellCheck={true}
            style={{
              width: "89%",
              fontSize: "15px",
              padding: "6.5px",
              height: "65%",
              backgroundColor: "#171717",
              boxSizing: "border-box",
              boxShadow: "none",
              border: "none",
              overflow: "auto",
              maxHeight: "200",
              outline: "none",
              WebkitBoxShadow: "none",
              MozBoxShadow: "none",
              resize: "none",
            }}
          ></textarea>
          <div
            className="items-center justify-between flex flex-row px-4"
            style={{
              backgroundColor: "#171717",
              width: "8%",
              borderRadius: "0px 4px 4px 0px",
              height: "65%",
            }}
          >
            <ScanSearch
              onClick={() => {}}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
            &nbsp;
            <Smile
              onClick={() => {
                setShowEmoji(!emoji);
              }}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
