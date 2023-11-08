"use client";
import Layout from "@/components/Layout";
import AddFriendModal from "@/components/modals/AddFriendModal";
import { Switch } from "@/components/ui/switch";
import { useClient } from "@/context/ClientContext";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Friend } from "strafe.js";

export default function Friends() {
    const { friends } = useClient();
    const [addFriend, setAddFriend] = useState(false);
    const [view, setView] = useState("online");

    console.log(friends);

    return (
        <Layout>
            <div className="w-full h-full">
                <div className="w-full h-12 rounded-b-lg bg-neutral-900 flex justify-between px-4 items-center font-bold">
                    <div className="flex items-center">
                        <h2 className="">Friends</h2>
                        <div className="w-[1px] mx-4 h-5 bg-gray-500"></div>
                        <div className="flex gap-8">
                            <button onClick={() => setView("online")}>Online</button>
                            <button onClick={() => setView("all")}>All</button>
                            <button onClick={() => setView("pending")}>Pending</button>
                            <button onClick={() => setView("blocked")}>Blocked</button>
                            <button onClick={() => setView("settings")}>Settings</button>
                        </div>
                    </div>
                    <button onClick={() => setAddFriend(true)} className="text-blue-500 hover:text-blue-600"><PlusCircleIcon /></button>
                    {addFriend && <AddFriendModal set={setAddFriend} show={addFriend} />}
                </div>
                <div className="w-full h-[calc(100%-3rem)] p-4 flex flex-col">
                    {view == "pending" && <FriendsPending friends={friends!} />}
                    {view == "settings" && <FriendsSettings />}
                </div>
            </div>

        </Layout>
    )
}

function FriendsPending({ friends }: { friends: Friend[] }) {
    return (
        <ul className="w-full h-full">
            {friends.map((friend, index) => friend.status == "pending" && (
                <li key={index} className="w-full p-2 bg-neutral-800">test</li>
            ))}
        </ul>
    )
}

function FriendsSettings() {
    return (
        <div className="w-full h-full">
            <Switch checked={true} />
        </div>
    )
}