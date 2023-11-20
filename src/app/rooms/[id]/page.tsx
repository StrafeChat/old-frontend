"use client";
import Layout from "@/components/Layout";
import PrivateMessageRoom from "@/components/channel/PrivateMessageRoom";
import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";
import { PmRoom } from "strafe.js";

interface Data {
  room: PmRoom | null;
  messages: any[];
}

export default function Room({ params }: { params: { id: string } }) {
  const { pms } = useClient();
  const [data, setData] = useState<Data>({
    room: null,
    messages: [],
  });

  useEffect(() => {
    const pm = pms!.find((pm) => pm.id == params.id);
    if (pm) setData({ ...data, room: pm });
    else setData({ room: null, messages: [] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, pms]);

  // useEffect(() => {
  //   if (room?.type == 0) {
  //     room!.fetchMessages(1).then((res) => {
  //       if (res.code == 200) setMessages([...res.data]);
  //     });
  //   }
  //   console.log("53", room);
  // }, [room]);


  return (
    <Layout>
      <div className="w-full h-full">{data.room && <>{data.room.type == 0 && <PrivateMessageRoom room={data.room} />}</>}</div>
    </Layout>
  );
}
