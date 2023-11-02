/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GuildList({ position }: { position: string }) {
  const { client } = useClient();

  return (
    <ul className={`guild-sidebar-${position}`}>
      <img src={client?.user?.avatar ? client.user.avatar : ""} className="border border-[#2F3136] w-12 h-12 rounded-lg select-none p-0.5" alt="profile picture" />
      <div className={`${position == "left" ? "w-[45px] h-0.5 my-1" : "w-0.5 h-[45px] mx-1"} bg-gray-200 opacity-30`}></div>
    </ul>
  );
}
