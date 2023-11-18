import { useClient } from "@/context/ClientContext";
import { PlusCircle, ScanSearch, Smile } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PmRoom } from "strafe.js";
import { emojis } from "@/assets/emojis";
import twemoji from "twemoji";

export default function ChatBox({ room }: { room: PmRoom }) {
  const { client } = useClient();
  const inputRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");

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
      ":([a-zA-Z0-9]+):": (match, emojiName) => {
        const emojiValue = emojis[emojiName];
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

  return (
    <div
      style={{ height: "4.5rem", maxHeight: "22.5rem" }}
      className="w-full flex flex-col px-3 justify-center group"
    >
      <div className="w-full h-[90%] bg-[rgba(255,255,255,0.1)] rounded-lg flex border border-transparent">
        <div className="px-4 text flex items-center">
          <PlusCircle className="w-7 h-7" />
        </div>
        <div className="w-full">
          <div
            className="w-full placeholder:flex items-center text-lg outline-none py-3.5 overflow-y-auto break-all resize-none group-focus:border-red-500"
            contentEditable={true}
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
            placeholder={`Message @${
              recipient.displayName ?? recipient.username
            }`}
          />
        </div>
        <div className="px-4 flex items-center gap-4">
          <ScanSearch className="w-7 h-7" />
          <Smile />
        </div>
      </div>
      <div className="w-full h-3" />
    </div>
  );
}
