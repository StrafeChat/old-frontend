import Image from "next/image";
import { useClient } from "@/context/ClientContext";
import { PlusCircle, ScanSearch, Smile, File, XCircle } from "lucide-react";
import { Buffer } from "buffer";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { PmRoom } from "strafe.js";
import { emojis } from "@/assets/emojis";
import twemoji from "twemoji";
import DOMPurify from 'dompurify';

export default function ChatBox({ room }: { room: PmRoom }) {
  const { client } = useClient();
  const inputRef = useRef<HTMLDivElement>(null);
  const [viewImages, setViewImage] = useState<any[]>([]);
  const [content, setContent] = useState("");

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.height = "auto"; // Reset the height to auto before getting the scroll height
  //     const height = inputRef.current.scrollHeight;
  //     inputRef.current.style.height = `${height}px`;
  //   }
  // }, [content, viewImages]);

  const handleInput = useCallback((event: Event) => {
    if (inputRef.current) {
      const text = inputRef.current.innerHTML;
      setContent(inputRef.current.innerText);
      const formattedText = formatMarkdown(text);
      inputRef.current.innerHTML = formattedText;
      twemoji.parse(inputRef.current, {
        className: "w-7 h-7 inline-block",
      });
      placeCaretAtEnd();
    }
  }, []);

  const placeCaretAtEnd = () => {
    if (inputRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  useEffect(() => {
    const input = inputRef.current;

    if (input) {
      input.addEventListener("input", handleInput);
    }

    return () => {
      if (input) {
        input.removeEventListener("input", handleInput);
      }
    };
  }, [handleInput]);

  const formatMarkdown = (text: string): string => {
    const markdownPatterns: Record<
      string,
      (match: string, ...groups: string[]) => string
    > = {
      "\\*\\*(.*?)\\*\\*": (_match, content) =>
        `<span class="text-gray-300">**</span><span class="font-bold">${content}</span><span class="text-gray-300">**</span>`,
      "\\*(.*?)\\*": (_match, content) =>
        `<span class="text-gray-300">*</span><span class="italic">${content}</span><span class="text-gray-300">*</span>`,
      "__(.*?)__": (_match, content) =>
        `<span class="text-gray-300">__</span><span class="underline">${content}</span><span class="text-gray-300">__</span>`,
      "\\|\\|(.*?)\\|\\|": (_match, content) =>
        `<span class="text-gray-300">||</span><span class="bg-gray-700 bg-opacity-80 p-1 rounded-md">${content}</span><span class="text-gray-300">||</span>`,
      "~~(.*?)~~": (_match, content) =>
        `<span class="text-gray-300">~~</span><span class="line-through">${content}</span><span class="text-gray-300">~~</span>`,
      "`(.*?)`": (_match, content) =>
        `<span class="text-gray-300">\`</span><span class="bg-gray-900 bg-opacity-40 p-1 rounded-md">${content}</span><span class="text-gray-300">\`</span>`,
      "\\[(.*?)]\\((.*?)\\)": (_match, text, url) =>
        `[${text}]<a href="${url}" class="text-blue-500">${url}</a>`,
      ":([a-zA-Z0-9]+)(?::([a-zA-Z0-9]+))*:": (match, ...groups) => {
        const emojiArr: string[] = [];
        const parser = new DOMParser();
        const emojiValue = groups.filter((group) => group !== undefined)
          .map((content) => {
            const regex = /<img[^>]*>/g;
            if (regex.test(content)) {
              content.match(regex)?.forEach((match) => {
                const doc = parser.parseFromString(match, 'text/html');
                const imgElement = doc.querySelector('img');
                if (imgElement) emojiArr.push(imgElement.getAttribute('alt')!);
              });
            }
            return emojiArr.join("");
          })
          .join('');

        console.log(emojiValue);

        return emojiValue ? emojiValue : match;
      },
    };

    let formattedText = text;

    for (const pattern in markdownPatterns) {
      const regex = new RegExp(pattern, "g");
      formattedText = formattedText.replace(regex, markdownPatterns[pattern]);
    }

    return formattedText;
  };

  const recipient = room.recipients.find(
    (recipient) => recipient.id != client?.user!.id
  )!;

  function isImage(value: any) {
    const types = ["image/png", "image/gif", "image/jpeg"];
    const video = ["video/mp4"];
    if (types.find((val) => val === value)) return "image";
    else if (video.find((val) => val === value)) return "video";
    else return "other";
  }

  const onSelectFile = (e: any | null) => {
    if (!e || e?.files?.length === 0 || e?.target?.files?.length === 0) return;

    function clearFileInput(ctrl: any) {
      try {
        ctrl.value = null;
      } catch (ex) { }
      if (ctrl.value) {
        ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
      }
    }

    const selectedFiles = Array.from(e?.target?.files! || e?.files);

    Promise.all(
      selectedFiles.map((file: any) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            let id = Math.round(+(Date.now() * file.name.length * Math.random()).toString());
            resolve({ id, file: reader.result, name: file.name, type: file.type });
          };
        });
      })
    ).then((results: any) => {
      clearFileInput((document.getElementById("images") as HTMLInputElement));
      console.log(...results)
      setViewImage([...viewImages, ...results]);
    });
  };

useEffect(() => {
  function onPaste(event: ClipboardEvent) {
    event.preventDefault()
    let text = event.clipboardData!.getData('text/plain');
    if (event.clipboardData!.files.length > 0) onSelectFile(event.clipboardData!)
    if (text) document.execCommand('insertText', false, text);
  }
  
  window.addEventListener("paste", onPaste)
  return () => window.removeEventListener("paste", onPaste)
  }, [])

  return (
    <div
      style={{ height: `${viewImages.length > 0 ? "13rem" : inputRef.current ? inputRef.current.scrollHeight : ""}`, maxHeight: "50vh" }}
      className="w-full flex flex-col px-3 justify-center duration-1000 z-2"
    >

      {viewImages.length > 0 && (
        <div className="relative w-full h-[10rem] bg-[#3C3C3C] rounded-t-lg flex overflow-x-auto overflow-y-hidden items-center px-2">
          <div className="absolute justify-between flex flex-row px-4 gap-4 items-center">
            {viewImages.map((fi) => (
              <div className="relative bg-[#2B2D31] h-[8rem] w-[8rem] pb-4 items-center justify-center rounded-sm flex"
                key={fi.id}>
                <XCircle
                  onClick={() => setViewImage((files) => files.filter((file) => file.id !== fi.id))}
                  height="20"
                  className="cursor-pointer hover:text-red-500 rounded-sm absolute"
                  style={{ right: -10, bottom: -9 }}
                />
                <div className="absolute select-none" style={{ fontSize: "9px", left: 3, bottom: 0 }}>{fi.name.length > 16 ? `${fi.name.slice(0, 18)}...` : fi.name}</div>
                  {isImage(fi.type) === "image" && (
                    <Image src={fi.file} alt={fi.id} className="max-h-24 max-w-max" width="128" height="128" draggable={false}/>
                  )}

                  {isImage(fi.type) === "video" && (
                    <video disablePictureInPicture disableRemotePlayback className="max-h-24">
                      <source src={fi.file} type="video/mp4" />
                    </video>
                  )}

                  {isImage(fi.type) === "other" && (
                    <File className="w-[75%] h-[75%]" />
                  )}

              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid " + (viewImages.length < 1 ? "transparent" : "rgba(255,255,255,0.1)") }} className={`overflow-y-auto w-full bg-[rgba(255,255,255,0.1)] rounded-b-lg ${viewImages.length < 1 && "rounded-t-lg"} flex`} tabIndex={0}>
        <div className="mx-4 flex items-center relative group w-7">
          <PlusCircle className="w-7 h-7 group-hover:text-green-500 rounded-full absolute top-2" />
          <input
            id="images"
            className="absolute w-7 h-7 rounded-full opacity-0 cursor-pointer top-2"
            multiple={true}
            title="Select a file"
            type="file"
            onChange={onSelectFile}
            accept="image/png, image/gif, image/jpeg, .json, application/json, .mp4, .txt"
          ></input>
        </div>
        <div className="w-full">
          <div
            className="w-full h-full placeholder:flex items-center text-lg outline-none py-2 overflow-y-auto break-all resize-none scrollbar-none"
            contentEditable={true}
            id="textbox"
            role={"textbox"}
            ref={inputRef}
            onKeyDown={(event) => {
              if (event.key == "Enter" && !event.shiftKey) {
                event.preventDefault();
                room!.send(content, []);
                setContent("");
                event.currentTarget.innerText = "";
              }
            }}
            placeholder={`Message @${recipient.displayName ?? recipient.username
              }`}
          />
        </div>
        <div className="mx-4 flex items-center relative group w-7">
          <ScanSearch className="w-7 h-7 absolute top-2" />
        </div>
        <div className="mr-4 flex items-center relative group w-7">
          <Smile className="w-7 h-7 absolute top-2" />
        </div>
      </div>
      <div className="w-full mt-[1rem]" />
    </div>
  );
}
