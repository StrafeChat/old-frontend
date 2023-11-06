"use client";
import Layout from "@/components/Layout";
import AddFriendModal from "@/components/modals/AddFriendModal";
import { Switch } from "@/components/ui/switch";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export default function Friends() {
    const [addFriend, setAddFriend] = useState(false);
    const [view, setView] = useState("online");

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
                    {view == "settings" && <FriendsSettings/>}
                </div>
            </div>

        </Layout>
    )
}

function FriendsSettings() {
    return (
        <div className="w-full h-full">
            <Switch checked={true}/>
        </div>
    )
}