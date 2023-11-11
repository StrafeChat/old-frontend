import { useClient } from "@/context/ClientContext";
import Image from "next/image";
import Link from "next/link";
import { User } from "strafe.js";
import { DmRoom } from "strafe.js/dist/structures/Room";

export default function RoomList() {
  const { client, pms } = useClient();

  return (
    <div className="room-sidebar select-none">
      <div className="w-full h-full flex flex-col items-start">
        <div className="w-full px-4 h-full flex flex-col">
          {/* We need to figure out what to do here next lol */}
          <b>
            <h1 className="p-1 fon text-lg w-full text-left mt-2.5">
              StrafeChat
            </h1>
          </b>
          <hr className="opacity-10 w-" />
          <Link
            href={"/"}
            className="p-1 rounded-md w-full font-bold hover:bg-[rgba(255,255,255,0.1)] text-left mt-2"
          >
            Home
          </Link>
          <Link
            href={"/friends"}
            className="p-1 rounded-md w-full font-bold hover:bg-[rgba(255,255,255,0.1)] text-left"
          >
            Friends
          </Link>
          <span className="mt-2.5 text-gray-500 hover:text-gray-400 font-bold uppercase cursor-pointer text-sm">
            Private Messages
          </span>
          <ul className="w-full h-full mt-1.5 flex flex-col items-center overflow-y-auto">
            {pms?.map((pm, index) => {
              return (
                <li
                  key={index}
                  className="w-full p-1 hover:bg-stone-800 rounded-md cursor-pointer"
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

function PrivateMessage({ pm, user }: { pm?: DmRoom; user?: User }) {
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
        <span className="text-[14px] font-bold">{user.username}</span>
        <span className="text-[11px]">{user.status.name.charAt(0).toUpperCase() + user.status.name.slice(1)}</span>
      </div>
    </Link>
  );
}
