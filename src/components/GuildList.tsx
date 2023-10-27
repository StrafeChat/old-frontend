/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";

export default function GuildList() {
  const { client } = useClient();

  return (
    <ul className="guild-sidebar">
      <img src={client?.user!.avatar!} draggable={false} className="w-12 h-12 rounded-lg select-none p-0.5"></img>
    </ul>
  );
}
