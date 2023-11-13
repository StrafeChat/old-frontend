import Image from "next/image";
import Markdown, { Components } from "react-markdown";
import ReactTimeago from "react-timeago";
import remarkGfm from 'remark-gfm'

const components: Partial<Components> = {
  p: ({ node, ...props }) => {
    return (
      <>
        {node?.children.map((child: any, index) => (
          <div className="text-md" key={index}>
            {child.tagName != "code" ? child.value : (
                <div className="bg-neutral-700 w-fit p-1 my-1 rounded-md">
                {child.children.map((child: any) => child.value)}
                </div>
            )}
          </div>
        ))}
      </>
    );
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
            <div key={index} className="pr-4">{(child as any).children?.map((child: any, key: number) => (
                <code className="text-md p-1 w-full bg-black rounded-md block" key={key}>
                    {(child as any).value}
                </code>
            ))}</div>
        //   <code className="text-md p-1 w-full bg-black rounded-md" key={index}>
        //     {(child as any).value}
        //   </code>
        ))}
      </>
    );
  },
  blockquote: ({node}) => {
    return (
        <blockquote>
        {node?.children.map((child: any, key) => (
            <div key={key}>
            {child.children?.map((child: any, key: number) => (
                <div key={key} className="flex gap-1 h-fit">
                    <div className="w-1 h-[1.5rem] rounded-full bg-[rgba(255,255,255,0.1)]"></div>
                    <span>{child.value}</span>
                </div>
            ))}
            </div>
            // <div key={key} className="flex gap-2">
            //     <div className="w-1 h-full bg-black"/>
            //     <span>{(child as any).value}</span>
            // </div>
        ))}
        </blockquote>
    )
  }
};

const plugins = [remarkGfm];

export default function Message({
  messages,
  message,
  index,
}: {
  messages: any[];
  message: any;
  index: number;
}) {
  if (index > 0) {
    if (messages[index - 1].author.id == message.author.id)
      return (
        <li key={index} className="flex gap-2.5 message break-normal">
          <div className="w-10 flex-shrink-0"></div>
          <span style={{ whiteSpace: 'pre-line' }} className="w-full">
            <Markdown remarkPlugins={plugins} components={components}>{message.content}</Markdown>
          </span>
        </li>
      );
    else
      return (
        <li key={index} className="flex gap-2.5 pt-2 message">
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
            <div style={{ whiteSpace: 'pre-line' }} className="w-full">
              <Markdown remarkPlugins={plugins} components={components}>{message.content}</Markdown>
            </div>
          </div>
        </li>
      );
  } else {
    return (
      <li key={index} className="flex gap-2.5 pt-2 message">
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
          <div style={{ whiteSpace: 'pre-line' }} className="w-full">
            <Markdown remarkPlugins={plugins} components={components}>{message.content}</Markdown>
          </div>
        </div>
      </li>
    );
  }
}
