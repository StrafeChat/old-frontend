import { useClient } from "@/context/ClientContext";
import Image from "next/image";
import Link from "next/link";
import { User } from "strafe.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faUserGroup, faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { PmRoom } from "strafe.js/dist/structures/Room";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";

export default function RoomList() {
  const { client, pms } = useClient();
  const pathname = usePathname();

  return (
    <div className="room-sidebar select-none">
      <div className="w-full h-full flex flex-col items-start">
        <div className="w-full px-4 h-full flex flex-col">
          {/* We need to figure out what to do here next lol */}
          <b>
            <div className="flex items-center justify-between">
              <h1 className="p-1 fon text-lg text-left mt-2.5">
                StrafeChat&nbsp;
                <span className="px-0.5 py-0.5 w-[1px] h-[0.5px] text-white bg-[#737d3c] text-sm rounded">
                  <b>BETA</b>
                </span>
              </h1>
            </div>
          </b>
          <hr className="opacity-10 w-" />
          <Link
            href={"/"}
            className={`p-1 rounded-md w-full items-center flex font-bold hover:bg-[rgba(255,255,255,0.1)] text-left mt-2 ${pathname == "/" ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
          >
            <FontAwesomeIcon icon={faHouseChimney} className="mr-2"/>
            Home
          </Link>
          <Link
            href={"/friends"}
            className={`p-1 rounded-md w-full items-center flex font-bold hover:bg-[rgba(255,255,255,0.1)] text-left mt-1.5 ${pathname == "/friends" ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
          >
            <FontAwesomeIcon icon={faUserGroup} className="mr-1.5" />  
            Friends
          </Link>
          <Link
            href={"/notes"}
            className={`p-1 rounded-md w-full items-center flex font-bold hover:bg-[rgba(255,255,255,0.1)] text-left mt-1.5 ${pathname == "/notes" ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
          >
            <FontAwesomeIcon icon={faNoteSticky} className="mr-3" />  
            Notes
          </Link>
          <span className="mt-2.5 text-gray-500 hover:text-gray-400 font-bold uppercase cursor-pointer text-sm">
            Private Messages
          </span>
          <ul className="w-full h-full mt-1.5 flex flex-col items-center overflow-y-auto">
            {pms?.map((pm, index) => {
              return (
                <li
                  key={index}
                  className={`w-full p-1 hover:bg-stone-800 rounded-md cursor-pointer ${pathname == `/rooms/${pm.id}` ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
                >
                  <PrivateMessage
                    pm={pm}
                    user={pm.recipients.find(
                      (user) => user.id != client?.user!.id
                    )}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PrivateMessage({ pm, user }: { pm?: PmRoom; user?: User }) {
  if (!user || !pm) return <div></div>;

  return (
    <Link
      href={`/rooms/${pm.id}`}
      className="w-full h-full flex gap-2 items-center"
    >
      <div className="relative">
        <Image
          src={user.avatar!}
          width={32}
          height={32}
          alt="avatar"
          className="rounded-full"
        />
        <div
          className={`status-${user.status.name} w-3 h-3 absolute border border-[#2F3136] right-0 bottom-0 rounded-full`}
        ></div>
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-bold">{user.displayName || user.username}</span>
        <span className="text-[11px]">
          {user.status.name.charAt(0).toUpperCase() + user.status.name.slice(1)}
        </span>
      </div>
    </Link>
  );
}
