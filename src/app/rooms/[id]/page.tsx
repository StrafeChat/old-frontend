"use client";
import Layout from "@/components/Layout";
import { useClient } from "@/context/ClientContext";
import { ChangeEvent, useEffect, useRef, useState, MouseEvent } from "react";
import {
  ImagePlus,
  Smile,
  ScanSearch,
  ArrowDownNarrowWide,
  ArrowBigDown,
  XSquare
} from "lucide-react";
import { PmRoom } from "strafe.js/dist/structures/Room";
import Message from "@/components/Message";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
import VisitLinkModal from "@/components/modals/VisitLinkModal";

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
  const [viewImages, setViewImage] = useState<any[]>([]);
  const [room, setRoom] = useState<PmRoom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldScrollDown, setShouldScrollDown] = useState(true);
  const [linkWarning, setLinkWarning] = useState({ link: "", show: false });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    client?.on("messageCreate", (message) => {
      if (message.roomId == params.id) {
        message.attachments = images;
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
  }, [client, messages, params, images]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      console.log(event.key);
      if (event.key == "Escape") setViewImage([]);
    };

    const handleClick = (event: globalThis.MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element.id == "message-link") {
        event.preventDefault();
        setLinkWarning({ link: (element as HTMLLinkElement).href, show: true });
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keyup", (event) => handleKeyUp(event));
      window.removeEventListener("click", (event) => handleClick(event));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onSelectFile = (e: ChangeEvent<HTMLInputElement> | null) => {
    if (!e || !e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);

    setImage([...images, ...selectedFiles]);

    // for (let i = 0; i < e?.target!.files.length; i++) {
    //   let reader = new FileReader();
    //   reader.readAsDataURL(e?.target!.files[i]);
    //   reader.onload = (a) => {
    //     setViewImage([...viewImages, a?.target!.result?.toString()]);
    //   };
    // }

    Promise.all(
      selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve(reader.result);
          };
        });
      })
    ).then((results) => {
      // Update the viewImages state with the base64 data
      setViewImage([...viewImages, ...results]);
    });
  };
  return (
    <Layout>
      <>
        {linkWarning.show && (
          <VisitLinkModal
            show={linkWarning.show}
            set={setLinkWarning}
            link={linkWarning.link}
          />
        )}
      </>
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
        style={{
          height:
            viewImages.length > 0 ? "calc(100% - 17.4rem)" : "calc(100% - 7.4rem)",
        }}
        className="w-full flex flex-col justify-end pl-[10px] pb-[20px]"
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
                  (recipient: any) => recipient.id != client?.user!.id
                )?.displayName ??
                  room?.recipients.find(
                    (recipient: any) => recipient.id != client?.user!.id
                  )?.username}
              </b>
            </h1>
            <p>This is the start of your conversation</p>
          </div>
          <hr className="my-[15px] opacity-10 w-[85%]" />{" "}
          {messages.map((message, index) => {
            return (
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <Message
                    messages={messages}
                    message={message}
                    attachments={message.attachments}
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
      <>
        {typing.filter((type) => type != client?.user?.username).length > 0 && (
          <div className="w-full h-4 pl-[20px] py-[10px] bg-black flex items-center">
            {typing.filter((type) => type != client?.user?.username).join(", ")}{" "}
            is typing...
          </div>
        )}
        {emoji && <div></div>}
        {viewImages.length > 0 && (
          <div className="relative w-full h-[10rem] bg-[rgba(0,0,0,0.75)] flex overflow-x-auto overflow-y-hidden items-center px-2">
            <div className="absolute justify-between flex flex-row px-4 gap-4 items-center">
              {viewImages.map((im, i = 0) => (
                <div className="relative bg-[#1C1C1C] h-[8rem] items-center rounded-sm flex" key={i++}>
                  <XSquare onClick={() => setViewImage((files) => files.filter((file) => file !== im))} height="20" className="cursor-pointer hover:text-red-500 rounded-sm absolute" style={{ right: -10, bottom: -9 }} />
                  <Image src={im} alt={i.toString()} width="128" height="128" />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
      <div className="w-full h-[4.5rem] bg-inherit flex flex-row px-3 items-center">
        <div
          className="items-center justify-between flex flex-row px-4"
          style={{
            backgroundColor: "#171717",
            width: "5%",
            borderRadius: "4px 0px 0px 4px",
            height: "60%",
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
        <div
          id="chatbox"
          style={{
            width: "89%",
            fontSize: "15px",
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
            height: "60%",
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
              console.log(room!.send(content, images));
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
            height: "60%",
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
    </Layout>
  );
}
