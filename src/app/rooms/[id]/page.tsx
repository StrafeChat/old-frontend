"use client";
import Layout from "@/components/Layout";
import { useClient } from "@/context/ClientContext";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Smile,
  ScanSearch,
  ArrowDownNarrowWide,
  ArrowBigDown,
} from "lucide-react";
import Image from "next/image";
import { PmRoom } from "strafe.js/dist/structures/Room";
import TimeAgo from "react-timeago";
import Markdown from "react-markdown";
import Message from "@/components/Message";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Room({ params }: { params: { id: string } }) {
  const { client, pms, copyText } = useClient();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [emoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [images, setImage] = useState<any[]>([]);
  const [room, setRoom] = useState<PmRoom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldScrollDown, setShouldScrollDown] = useState(true);

  // useEffect(() => {
  //   const handleScroll = (event: Event) => {
  //     if (scrollContainerRef.current!.scrollTop < 1) {
  //       setCurrentPage((page) => page++);
  //       room?.fetchMessages(currentPage).then((msgs) => {
  //         setMessages([...msgs.data, ...messages]);
  //       });
  //     }
  //     setShowScrollButton(
  //       scrollContainerRef.current!.scrollHeight / 1.5 >
  //         scrollContainerRef.current!.scrollTop &&
  //         scrollContainerRef.current!.scrollHeight > 3000
  //     );
  //   };

  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.addEventListener("scroll", (event) =>
  //       handleScroll(event)
  //     );
  //   }

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [scrollContainerRef.current]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current!.scrollTop < 1) {
        setCurrentPage((page) => page + 1);
        room?.fetchMessages(currentPage).then((msgs) => {
          if (msgs.code != 200) return;
          if (
            msgs.data.some((newMsg: any) =>
              messages.some((msg) => msg.id === newMsg.id)
            )
          )
            return;

          setShouldScrollDown(false);
          setMessages((prevMessages) => [...msgs.data, ...prevMessages]);
        });
      }

      setShowScrollButton(
        scrollContainerRef.current!.scrollHeight / 1.5 >
          scrollContainerRef.current!.scrollTop &&
          scrollContainerRef.current!.scrollHeight > 3000
      );
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Remove the event listener from scrollContainerRef.current
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef.current, currentPage, room]);

  useEffect(() => {
    setRoom(pms?.find((pm) => pm.id == params.id)!);
    console.log("46", room);
  }, [params.id, pms, room]);

  useEffect(() => {
    room?.fetchMessages(1).then((res) => {
      setShouldScrollDown(true);
      if (res.code == 200) setMessages([...res.data]);
    });
    console.log("53", room);
  }, [room]);

  useEffect(() => {
    client?.on("messageCreate", (message, attachments) => {
      console.log(attachments)
      if (message.roomId == params.id) {
        //const data = new FormData();
        //const attachment = data.append('file', new Blob([JSON.stringify(attachments)], { type: 'application/json' }));
        setShouldScrollDown(true);
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
  }, [client, messages, params]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {};

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", (event) => handleKeyUp(event));
    };
  }, []);

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
    if (shouldScrollDown) {
      if (scrollContainerRef.current)
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
    }
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

  const onSelectFile = (e: any | null) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImage(e?.target!.files[0]);
  };

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
              className="absolute right-10 bottom-15 cursor-pointer z-[999] bg-[#737d3c] rounded-md p-2"
              onClick={() => {
                if (scrollContainerRef.current)
                  scrollContainerRef.current.scrollTop =
                    scrollContainerRef.current.scrollHeight;
              }}
            >
              <ArrowBigDown />
            </button>
          )}

          <ul
            className="w-full h-fit flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#737d3c] scrollbar-thumb-rounded-full scrollbar-track-transparent relative"
            ref={scrollContainerRef}
          >
            <div className="pt-[25px]">
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
            <hr className="my-[15px] opacity-10 w-[85%]" />{" "}
            {/* Why is it like  */}
            {messages.map((message, index) => {
              return (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <Message
                      messages={messages}
                      message={message}
                      //attachments={attachments}
                      index={index}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Reply</ContextMenuItem>
                    <ContextMenuItem onClick={() => copyText!(message.content)}>
                      Copy Text
                    </ContextMenuItem>
                    {message.author.id == client?.user?.id && (
                      <>
                        <ContextMenuItem>Edit Message</ContextMenuItem>
                        <ContextMenuItem>Delete Message</ContextMenuItem>
                      </>
                    )}
                    <div className="w-full h-0.5 rounded-full bg-gray-500" />
                    <ContextMenuItem onClick={() => copyText!(message.id)}>
                      Copy Message ID
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
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
            <div className="flex group">
              <input
                id="images"
                className="absolute w-6 h-6 opacity-0 cursor-pointer"
                multiple={true}
                type="file"
                onChange={onSelectFile}
                accept="image/png, image/gif, image/jpeg"
              ></input>
              <ImagePlus className="cursor-pointer group-hover:text-red-500 rounded-sm" />
            </div>
          </div>
          {/* <textarea
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
          ></textarea> */}
          <div
            id="chatbox"
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
            placeholder={`Send a message to @${
              room?.recipients.find(
                (recipient) => recipient.id != client?.user!.id
              )?.displayName ||
              room?.recipients.find(
                (recipient) => recipient.id != client?.user!.id
              )?.username
            }`}
            contentEditable
            onInput={(event) => setContent(event.currentTarget.innerText)}
            onKeyDown={(event) => {
              if (event.key == "Enter" && !event.shiftKey) {
                event.preventDefault();
                room?.send(content, images);
                setContent("");
                event.currentTarget.innerText = "";
              }
            }}
          ></div>
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
