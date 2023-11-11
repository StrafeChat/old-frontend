"use client";
import Layout from "@/components/Layout";
import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";
import { User } from "strafe.js";
import { DmChannel } from "strafe.js/dist/structures/Channel";
import { ImagePlus, Smile, ScanSearch } from "lucide-react";
import Image from "next/image";

export default function Room({ params }: { params: { id: string } }) {
  const { client, pms } = useClient();

  const [room, setRoom] = useState<{ user: User | null }>({
    user: null,
  });

  useEffect(() => {
    setRoom(() => {
      const pm = pms?.find((pm) => pm.id == params.id);
      return {
        user: pm?.recipients.find((user) => user.id !== client?.user!.id)!,
      };
    });
  }, [client?.user, params, pms]);

  return (
    <Layout>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-12 rounded-b-lg bg-neutral-900 flex justify-between px-4 items-center font-bold">
          <div className="flex gap-2 items-center">
            <Image
              src={room.user?.avatar!}
              width={32}
              height={32}
              className="rounded-full"
              alt=""
            />
            <span>@{room.user?.displayName || room.user?.username}</span>
          </div>
        </div>
        <div className="w-full h-[calc(100%-104px)]"></div>
        <div className="w-full h-14 bg-black flex flex-row px-3 items-center">
          <div
            className="items-center justify-between flex flex-row px-4"
            style={{
              backgroundColor: "#171717",
              width: "5%",
              borderRadius: "4px 0px 0px 4px",
              height: "65%",
            }}
          >
            <ImagePlus
              onClick={() => {}}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
          </div>
          <textarea
            placeholder={`Send a message to @${
              room.user?.displayName || room.user?.username
            }`}
            style={{
              width: "89%",
              fontSize: "15px",
              padding: "6.5px",
              height: "65%",
              backgroundColor: "#171717",
              boxSizing: "border-box",
              boxShadow: "none",
              border: "none",
              overflow: "auto",
              maxHeight: "200",
              outline: "none",
              WebkitBoxShadow: "none",
              MozBoxShadow: "none",
              resize: "none",
            }}
          ></textarea>
          <div
            className="items-center justify-between flex flex-row px-4"
            style={{
              backgroundColor: "#171717",
              width: "8%",
              borderRadius: "0px 4px 4px 0px",
              height: "65%",
            }}
          >
            <ScanSearch
              onClick={() => {}}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
            &nbsp;
            <Smile
              onClick={() => {}}
              className="cursor-pointer hover:text-red-500 rounded-sm"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
