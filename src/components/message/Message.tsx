import Image from "next/image";
import ReactTimeago from "react-timeago";
import twemoji from "twemoji";
import { emojis } from "@/assets/emojis";
import { useEffect, useRef } from "react";

export default function Message({
  sameAuthor,
  message,
}: {
  sameAuthor?: boolean;
  message: any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const formatMarkdown = (text: string): string => {
    const hasEmojis = /[\p{Emoji}]/u.test(text);

    if (hasEmojis) {
      text = text.replace(/([\p{Emoji}])/gu, (value) => {
        return `<span class="emoji">${value}</span>`;
      });
    }

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
      ":([a-zA-Z0-9]+):": (match, content) => {
        const emojiValue = emojis[content];
        return emojiValue ? `<span class="emoji">${emojiValue}</span>` : match;
      },
      //   "/^[\p{Emoji}\s]+$/u": (match, content) => {
      //     return "test";
      //   }
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
      const onlyEmoji = /^([\p{Emoji}\s]+|:\w+:)$/u.test(
        message.content.trim()
      );

      const emojiElements = ref.current.querySelectorAll("span.emoji");

      // Parse each emoji individually
      emojiElements.forEach((emojiElement) => {
        twemoji.parse(emojiElement as HTMLElement, {
          className: onlyEmoji
            ? "w-14 h-14 inline-block"
            : "w-7 h-7 inline-block",
        });
      });
    }
  }, [message]);

  return !!sameAuthor ? (
    <li className="message child">
      <div className="w-10 flex-shrink-0"></div>
      <div ref={ref} />
    </li>
  ) : (
    <li className="message parent">
      <div className="w-10 h-10 flex-shrink-0">
        <Image
          src={message.author.avatar}
          width={50}
          height={50}
          alt="profile"
          className="rounded-full select-none"
        />
      </div>
      <div className="flex flex-col">
        <span className="flex items-center gap-3">
          <b>{message.author.displayName || message.author.username}</b>
          <ReactTimeago
            className="text-gray-400 text-xs"
            date={new Date(message.createdAt).getTime() - 500}
          />
        </span>
        <div ref={ref} />
      </div>
    </li>
  );
}
