/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useClient } from "@/context/ClientContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GuildList({ position }: { position: string }) {
  const { client } = useClient();
  console.log(position)

  return (
    <ul className={`guild-sidebar-${position}`}>
        <div style={{ paddingTop: "-10px"}} className="w-full h-14 rounded-r-sm">
                    <img style={{border: "2px solid #2F3136"}}
                      src={client?.user!.avatar!}
                      draggable={false}
                      className="w-12 h-12 rounded-lg select-none p-0.5"
                    ></img>
                    <hr className="w-[50px] mx-auto my-2 border-gray-200 border-opacity-30"></hr>
                  </div>
                <div className="w-full h-11 flex items-center justify-center ">
                  </div>
              </ul>
            );
          }
