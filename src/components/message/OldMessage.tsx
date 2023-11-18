import Image from "next/image";
import Markdown, { Components } from "react-markdown";
import ReactTimeago from "react-timeago";
import remarkGfm from "remark-gfm";
import emojis from "../../assets/emojis";
import Twemoji from "react-twemoji";
import React from "react";

const components: Partial<Components> = {
  p: ({ node }) => {
    const regex = /:(\w+):/g;
    switch (node?.type) {
      case "element":
        return (
          <>
            {node.children.map((child, key) => {
              switch (child.type) {
                case "text":
                  return (
                    <p key={key}>
                      {child.value.replace(
                        regex,
                        (_match, code) => (emojis as any)[code] ?? `:${code}:`
                      )}
                    </p>
                  );
              }
            })}
          </>
        );
    }
  },
  h1: ({ node }) => {
    return (
      <>
        {node?.children.map((child, index) => (
          <h1 className="text-3xl font-bold" key={index}>
            {(child as any).value}
          </h1>
        ))}
      </>
    );
  },
  pre: ({ node }) => {
    return (
      <>
        {node?.children.map((child, index) => (
          <div key={index} className="pr-4">
            {(child as any).children?.map((child: any, key: number) => (
              <code
                className="text-md p-1 w-full bg-black rounded-md block"
                key={key}
              >
                {(child as any).value}
              </code>
            ))}
          </div>
          //   <code className="text-md p-1 w-full bg-black rounded-md" key={index}>
          //     {(child as any).value}
          //   </code>
        ))}
      </>
    );
  },
  code: ({ node }) => {
    return (
      <>
        {node?.children.map((child, index) => {
          switch (child.type) {
            case "text":
              return <code className="bg-black p-0.5">{child.value}</code>;
          }
        })}
      </>
    );
  },
  blockquote: ({ node }) => {
    return (
      <blockquote>
        {node?.children.map((child: any, key) => (
          <div key={key}>
            {child.children?.map((child: any, key: number) => (
              <div key={key} className="flex gap-1 h-fit">
                <div className="w-1 h-[2rem] rounded-full bg-[rgba(255,255,255,0.1)]"></div>
                <span>{child.value}</span>
              </div>
            ))}
          </div>
        ))}
      </blockquote>
    );
  },
  table: ({ node }) => {
    return (
      <table className="bg-stone-900 border">
        {node?.children.map((child, key) => {
          switch (child.type) {
            case "element":
              switch (child.tagName) {
                case "thead":
                  return (
                    <thead key={key}>
                      {child.children.map((child, key) => {
                        switch (child.type) {
                          case "element":
                            switch (child.tagName) {
                              case "tr":
                                return (
                                  <tr key={key}>
                                    {child.children.map((child) => {
                                      switch (child.type) {
                                        case "element":
                                          switch (child.tagName) {
                                            case "th":
                                              return (
                                                <React.Fragment key={key}>
                                                  {child.children.map(
                                                    (child, key) => {
                                                      switch (child.type) {
                                                        case "text":
                                                          return (
                                                            <th key={key} className="border p-2">
                                                              {child.value}
                                                            </th>
                                                          );
                                                      }
                                                    }
                                                  )}
                                                </React.Fragment>
                                              );
                                          }
                                      }
                                    })}
                                  </tr>
                                );
                            }
                        }
                      })}
                    </thead>
                  );
                case "tbody":
                  return (
                    <tbody>
                      {child.children.map((child, key) => {
                        switch (child.type) {
                          case "element":
                            switch (child.tagName) {
                              case "tr":
                                return (
                                  <tr key={key}>
                                    {child.children.map((child, key) => {
                                      switch (child.type) {
                                        case "element":
                                          switch (child.tagName) {
                                            case "td":
                                              return (
                                                <React.Fragment key={key}>
                                                  {child.children.map(
                                                    (child) => {
                                                      switch (child.type) {
                                                        case "text":
                                                          return (
                                                            <td className="border p-2">
                                                              {child.value}
                                                            </td>
                                                          );
                                                      }
                                                    }
                                                  )}
                                                </React.Fragment>
                                              );
                                          }
                                      }
                                    })}
                                  </tr>
                                );
                            }
                        }
                      })}
                    </tbody>
                  );
              }
              break;
          }
        })}
      </table>
    );
  },
  a: ({ node }) => {
    return (
      <>
        {node?.children.map((child) => {
          switch (child.type) {
            case "text":
              return (
                <a
                  id="message-link"
                  className="text-[#737d3c] hover:text-[#737d3c] underline"
                  href={child.value}
                >
                  {child.value}
                </a>
              );
          }
        })}
      </>
    );
  },
};

const plugins = [remarkGfm];

export default function Message({
  messages,
  message,
  attachments,
  index,
}: {
  messages: any[];
  message: any;
  attachments: any[] | null;
  index: number;
}) {
  if (index > 0) {
    if (messages[index - 1].author.id == message.author.id)
      return (
        <li key={index} className="flex gap-2.5 message break-normal">
          <div className="w-10 flex-shrink-0"></div>
          <div style={{ whiteSpace: "pre-line" }} className="w-full">
            <Twemoji
              options={{ className: `message-emoji${!/^([\p{Emoji}\s]+|:\w+:)$/u.test(message.content.trim()) ? "-text" : ""}` }}
            >
              <Markdown remarkPlugins={plugins} components={components}>
                {message.content}
              </Markdown>
            </Twemoji>
          </div>
          {/* {attachments?.map((attachment) => (
            <Image key={attachment.url} src={attachment} alt='e' /> 
          ))} */}
        </li>
      );
    else
      return (
        <li key={index} className="flex gap-2.5 pt-3.5 message">
          <div className="w-10 h-10 flex-shrink-0">
            <Image
              src={message.author.avatar}
              width={50}
              height={50}
              alt="profile"
              className="rounded-full select-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex gap-1 mt-[-4.5px]">
              <span>
                <b>{message.author.displayName || message.author.username}</b>
                &nbsp;
                <ReactTimeago
                  className="text-gray-400 text-xs"
                  date={new Date(message.createdAt).getTime() - 500}
                />
              </span>
            </div>
            <div style={{ whiteSpace: "pre-line" }} className="w-full">
              <Twemoji
                options={{
                  className: `message-emoji${!/^([\p{Emoji}\s]+|:\w+:)$/u.test(message.content.trim()) ? "-text" : ""}`,
                }}
              >
                {" "}
                <Markdown remarkPlugins={plugins} components={components}>
                  {message.content}
                </Markdown>
              </Twemoji>
            </div>
          </div>
        </li>
      );
  } else {
    return (
      <li key={index} className="flex gap-2.5 pt-3.5 message">
        <div className="w-10 h-10 flex-shrink-0">
          <Image
            src={message.author.avatar}
            width={50}
            height={50}
            alt="profile"
            className="rounded-full select-none"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-1 mt-[-8px] w-full">
            <span>
              <b>{message.author.displayName || message.author.username}</b>
              &nbsp;
              <ReactTimeago
                className="text-gray-400 text-xs"
                date={new Date(message.createdAt).getTime() - 500}
              />
            </span>
          </div>
          <div style={{ whiteSpace: "pre-line" }} className="w-full">
            <Twemoji
              options={{ className: `message-emoji${!/^([\p{Emoji}\s]+|:\w+:)$/u.test(message.content.trim()) ? "-text" : ""}` }}
            >
              <Markdown remarkPlugins={plugins} components={components}>
                {message.content}
              </Markdown>
            </Twemoji>
          </div>
        </div>
      </li>
    );
  }
}
