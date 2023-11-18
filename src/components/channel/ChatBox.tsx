import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatBox() {
  const inputRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");

  const handleInput = useCallback((event: Event) => {
    if (inputRef.current) {
      const text = inputRef.current.innerText;
      const formattedText = formatMarkdown(text);
      inputRef.current.innerHTML = formattedText;
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
    };

    let formattedText = text;

    for (const pattern in markdownPatterns) {
      const regex = new RegExp(pattern, "g");
      formattedText = formattedText.replace(regex, markdownPatterns[pattern]);
    }

    return formattedText;
  };

  return (
    <div className="w-full h-[7rem] px-8 py-2">
      <div className="h-[1rem] w-full mb-4 text-lg"></div>
      <div
        className="w-full h-[4rem] bg-neutral-900 rounded-md text-2xl px-2 py-3 overflow-y-auto outline-none scrollbar-thin"
        contentEditable={true}
        role={"textbox"}
        ref={inputRef}
      />
    </div>
  );
}
