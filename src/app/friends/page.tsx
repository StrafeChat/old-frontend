"use client";
import Layout from "@/components/Layout";
import AddFriendModal from "@/components/modals/AddFriendModal";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Switch } from "@/components/ui/switch";
import { useClient } from "@/context/ClientContext";
import { MoreVertical } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCheck,
  faX,
  faMessage,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Client, Friend, User } from "strafe.js";
import Header from "@/components/Header";
import Body from "@/components/Body";

export default function Friends() {
  const { client, friends } = useClient();
  const [addFriend, setAddFriend] = useState(false);
  const [view, setView] = useState("online");

  return (
    <Layout>
      <>{addFriend && <AddFriendModal show={addFriend} set={setAddFriend} />}</>
      <Header>
        <div className="flex">
          <h2>
            <b>Friends</b>
          </h2>
          <div className="w-[1px] mx-4 h-5 bg-gray-500" />
          <div className="flex gap-5">
            <button
              style={{
                backgroundColor: `${
                  view === "online" ? "rgba(255,255,255,0.1)" : ""
                }`,
                borderRadius: "7px",
                padding: "2px",
              }}
              className="hover:bg-[#222222]"
              onClick={() => setView("online")}
            >
              Online
            </button>
            <button
              style={{
                backgroundColor: `${
                  view === "all" ? "rgba(255,255,255,0.1)" : ""
                }`,
                borderRadius: "7px",
                padding: "2px",
              }}
              className="hover:bg-[#222222]"
              onClick={() => setView("all")}
            >
              All
            </button>
            <button
              style={{
                backgroundColor: `${
                  view === "pending" ? "rgba(255,255,255,0.1)" : ""
                }`,
                borderRadius: "7px",
                padding: "2px",
              }}
              className="hover:bg-[#222222]"
              onClick={() => setView("pending")}
            >
              Pending
            </button>
            <button
              style={{
                backgroundColor: `${
                  view === "blocked" ? "rgba(255,255,255,0.1)" : ""
                }`,
                borderRadius: "7px",
                padding: "2px",
              }}
              className="hover:bg-[#222222]"
              onClick={() => setView("blocked")}
            >
              Blocked
            </button>
          </div>
        </div>
        <button
          onClick={() => setAddFriend(true)}
          className="text-500 hover:text-blue-600"
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </button>
      </Header>
      <Body>
        <>
          {view == "online" && (
            <FriendsOnline client={client!} friends={friends!} />
          )}
          {view == "all" && <FriendsAll client={client!} friends={friends!} />}
          {view == "pending" && (
            <FriendsPending client={client!} friends={friends!} />
          )}
          {view == "settings" && <FriendsSettings />}
        </>
      </Body>
    </Layout>
  );
}

function FriendsOnline({
  client,
  friends,
}: {
  client: Client;
  friends: Friend[];
}) {
  useEffect(() => {
    client.user?.getPMS().then((dms) => {
      console.log(dms);
    });
  }, [client]);

  return (
    <div>
      <span className="text-gray-500 font-bold">
        ONLINE FRIENDS -{" "}
        {
          friends.filter(
            (friend) =>
              friend.status == "accepted" &&
              (friend.receiverId != client.user?.id
                ? friend.sender?.status.online
                : friend.receiver?.status.online)
          ).length
        }
      </span>
      <ul>
        {friends.map(
          (friend, index) =>
            friend.status == "accepted" && (
              <li key={index}>
                {friend.senderId == client.user?.id ? (
                  <FriendCard user={friend.receiver} />
                ) : (
                  <FriendCard user={friend.sender} />
                )}
              </li>
            )
        )}
      </ul>
    </div>
  );
}

function FriendCard({ user }: { user: User | null }) {
  const router = useRouter();

  return (
    <div className="w-full px-2 py-4 border border-transparent border-t-neutral-800 hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-between rounded-xl group cursor-pointer">
      <div className="flex gap-2">
        <div className="relative">
          <Image
            src={user?.avatar!}
            width={40}
            height={40}
            alt={user?.username!}
            className="rounded-full"
          />
          <div
            className={`absolute right-0 border border-[#262626] bottom-0 w-4 h-4 status-${user?.status.name} rounded-full`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">
            {user?.username}
            <span className="invisible group-hover:visible">#{user?.tag}</span>
          </span>
          <span className="text-sm text-gray-400 font-semibold">
            {user?.status.name
              ? user?.status?.name.charAt(0).toUpperCase() +
                user?.status?.name.slice(1)
              : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            user?.createPM().then((pm) => {
              if (pm.code == 409) router.push(`/rooms/${pm.data.id}`);
            });
          }}
          className="p-2 bg-[rgba(0,0,0,0.2)] rounded-lg hover:text-blue-500"
        >
          <FontAwesomeIcon icon={faMessage} />
        </button>
        <button className="p-2 bg-[rgba(0,0,0,0.2)] rounded-lg hover:text-green-500">
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>
    </div>
  );
}

function FriendsAll({
  client,
  friends,
}: {
  client: Client;
  friends: Friend[];
}) {
  return (
    <ul className="w-full h-full">
      <span className="text-gray-500 font-bold">
        ALL FRIENDS - {friends.length}
      </span>
      {friends.map(
        (friend, index) =>
          friend.status == "accepted" && (
            <div key={index}>
              {friend.senderId == client.user?.id ? (
                <li className="w-full px-2 py-4 border border-transparent border-t-neutral-800 hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-between rounded-xl group cursor-pointer">
                  <div className="flex gap-2">
                    <div className="relative">
                      <Image
                        src={friend.receiver?.avatar!}
                        width={40}
                        height={40}
                        alt={friend.receiver?.username!}
                        className="rounded-full"
                      />
                      <div
                        className={`absolute right-0 border border-[#262626] bottom-0 w-4 h-4 status-${friend.receiver?.status.name} rounded-full`}
                      ></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {friend.receiver?.username}
                        <span className="invisible group-hover:visible">
                          #{friend.receiver?.tag}
                        </span>
                      </span>
                      <span className="text-sm text-gray-400 font-semibold">
                        {friend.receiver?.status.online
                          ? friend.receiver?.status?.name
                              .charAt(0)
                              .toUpperCase() +
                            friend.receiver?.status?.name.slice(1)
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="w-full px-2 py-4 border border-transparent border-t-neutral-800 hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-between rounded-xl group cursor-pointer">
                  <div className="flex gap-2">
                    <div className="relative">
                      <Image
                        src={friend.sender?.avatar!}
                        width={40}
                        height={40}
                        alt={friend.sender?.username!}
                        className="rounded-full"
                      />
                      <div
                        className={`absolute right-0 bottom-0 w-4 h-4 status-${friend.sender?.status.name} rounded-full`}
                      ></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {friend.sender?.username}
                        <span className="invisible group-hover:visible">
                          #{friend.sender?.tag}
                        </span>
                      </span>
                      <span className="text-sm text-gray-400 font-semibold"></span>
                    </div>
                  </div>
                </li>
              )}
            </div>
          )
      )}
    </ul>
  );
}

function FriendsPending({
  client,
  friends,
}: {
  client: Client;
  friends: Friend[];
}) {
  // console.log(friends[0].client);

  return (
    <ul className="w-full h-full">
      {friends.map(
        (friend, index) =>
          friend.status == "pending" && (
            <div key={index}>
              {friend.senderId == client.user?.id ? (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <li className="w-full px-2 py-4 border border-transparent border-t-neutral-800 hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-between rounded-xl group cursor-pointer">
                      <div className="flex gap-2">
                        <Image
                          src={friend.receiver?.avatar!}
                          width={40}
                          height={40}
                          alt={friend.receiver?.username!}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            {friend.receiver?.username}
                            <span className="invisible group-hover:visible">
                              #{friend.receiver?.tag}
                            </span>
                          </span>
                          <span className="text-sm text-gray-400 font-semibold">
                            Outgoing Friend Request
                          </span>
                        </div>
                      </div>
                      <button className="p-2 bg-[rgba(0,0,0,0.2)] rounded-lg hover:text-red-500">
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </li>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Cancel</ContextMenuItem>
                    <ContextMenuItem>Block</ContextMenuItem>
                    <ContextMenuItem>Message</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ) : (
                <ContextMenu>
                  <ContextMenuTrigger>
                    <li
                      key={index}
                      className="w-full px-2 py-4 border border-transparent border-t-neutral-800 hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-between rounded-xl group cursor-pointer"
                    >
                      <div className="flex gap-2">
                        <Image
                          src={friend.sender?.avatar!}
                          width={40}
                          height={40}
                          alt={friend.receiver?.username!}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            {friend.sender?.username}
                            <span className="invisible group-hover:visible">
                              #{friend.sender?.tag}
                            </span>
                          </span>
                          <span className="text-sm text-gray-400 font-semibold">
                            Incoming Friend Request
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-3 bg-[rgba(0,0,0,0.2)] rounded-lg hover:text-green-500"
                          onClick={() => friend.update("accept")}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button className="p-3 bg-[rgba(0,0,0,0.2)] rounded-lg hover:text-red-500">
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    </li>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Accept</ContextMenuItem>
                    <ContextMenuItem>Reject</ContextMenuItem>
                    <ContextMenuItem>Block</ContextMenuItem>
                    <ContextMenuItem>Message</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )}
            </div>
          )
      )}
    </ul>
  );
}

function FriendsSettings() {
  const [everyone, setEveryone] = useState(false);
  const [friendsOfFriends, setFriendsOfFriends] = useState(false);
  const [serverMembers, setServerMembers] = useState(false);

  return (
    <div className="w-full h-full">
      <h2 className="text-lg uppercase text-gray-400 font-bold">
        Who can send you a friend request?
      </h2>
      <ul className="flex flex-col gap-2 px-4 py-2">
        <li className="flex justify-between">
          <span>Everyone</span>
          <Switch
            checked={everyone}
            onChange={() => setEveryone((prev) => !prev)}
          />
        </li>
        <li className="flex justify-between">
          <span>Friends of Friends</span>
          <Switch
            checked={friendsOfFriends}
            onChange={() => setFriendsOfFriends(!friendsOfFriends)}
          />
        </li>
        <li className="flex justify-between">
          <span>Server Members</span>
          <Switch
            checked={serverMembers}
            onChange={() => setServerMembers(!serverMembers)}
          />
        </li>
      </ul>
    </div>
  );
}
