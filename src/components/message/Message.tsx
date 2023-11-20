import Image from "next/image";
import ReactTimeago from "react-timeago";
import twemoji from "twemoji";
import UserProfileModal from '../modals/UserProfileModal';
import { emojis } from "@/assets/emojis";
import { useEffect, useRef, useState } from "react";
import { useClient } from "@/context/ClientContext";

export default function Message({
  sameAuthor,
  message,
}: {
  sameAuthor?: boolean;
  message: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const {client} = useClient();

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
      ":([^:]+):": (match, content) => {
        console.log(content);
        const emojiValue = emojis[content];
        return emojiValue ?? match;
      },
    };

    let formattedText = text;

    for (const pattern in markdownPatterns) {
      const regex = new RegExp(pattern, "g");
      formattedText = formattedText.replace(regex, markdownPatterns[pattern]);
    }

    return formattedText;
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = formatMarkdown(message.content);
      twemoji.parse(ref.current, {className: "w-7 h-7 inline-block"});
      // const onlyEmoji = /^([\p{Emoji}\s]+|:\w+:)$/u.test(
      //   message.content.trim()
      // );

      // const emojiElements = ref.current.querySelectorAll("span.emoji");

      // // Parse each emoji individually
      // emojiElements.forEach((emojiElement) => {
      //   twemoji.parse(emojiElement as HTMLElement, {
      //     className: onlyEmoji
      //       ? "w-14 h-14 inline-block"
      //       : "w-7 h-7 inline-block",
      //   });
      // });
    }
  }, [message]);

  return (
    <li id={message.id} className="group hover:bg-[rgba(0,0,0,0.1)]">
      <div className={`flex p-0.5 pe-4 ${!sameAuthor && "mt-3"}`}>
        <div className="w-[62px] flex flex-shrink-0 pt-0.5 justify-center">
          { !sameAuthor ? (
            <div className="rounded-full overflow-hidden w-10 h-10 duration-200 active:translate-y-0.5 cursor-pointer">
              <Image
                src={message.author.avatar}
                width={40}
                height={40}
                alt=""
              />
            </div>
          ) : (
            <time className="text-sm invisible group-hover:visible text-gray-500 font-bold">
              {Intl.DateTimeFormat(client?.user?.locale, {hour: "numeric", minute: "numeric", hour12: false}).format(new Date(message.createdAt))}
            </time>
          )}
        </div>
        <div className="relative min-w-0 flex-grow flex flex-col justify-center text-sm">
          { !sameAuthor && (
            <span className="gap-2 flex items-center flex-shrink-0">
              <span className="overflow-hidden cursor-pointer text-ellipsis whitespace-normal font-bold">
                {message.author.displayName ?? message.author.username}
              </span>
              <ReactTimeago date={message.createdAt} className="flex-shrink-0 gap-1 text-xs text-gray-500" />
            </span>
          )}
          <div ref={ref}/>
        </div>
      </div>

    </li>
  );
}
