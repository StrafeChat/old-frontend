import { useClient } from "@/context/ClientContext";

export default function ChannelList() {
  const { client } = useClient();

  return (
    <div className="channel-sidebar">
      <div className="w-full h-[calc(100%-4.5rem)]"></div>
    </div>
  );
}
