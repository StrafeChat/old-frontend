import { useClient } from "@/context/ClientContext";
import Link from "next/link";

export default function ChannelList() {
  const { client } = useClient();

  return (
    <div className="channel-sidebar">
      <div className="w-full h-[calc(100%-4.5rem)] flex flex-col items-start">
        <h2 className="font-bold p-4 text-left">Direct Messages</h2>
        <div className="w-full px-4 h-full flex flex-col">
          <Link href={"/"} className="p-1 rounded-md w-full font-bold hover:bg-[rgba(255,255,255,0.1)] text-left">Home</Link>
          <Link href={"/friends"} className="p-1 rounded-md w-full font-bold hover:bg-[rgba(255,255,255,0.1)] text-left">Friends</Link>
          <div className="w-full h-full flex flex-col items-center">
          </div>
        </div>
      </div>
    </div>
  );
}
