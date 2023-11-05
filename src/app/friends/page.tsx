"use client";
import Layout from "@/components/Layout";
import AddFriendModal from "@/components/modals/AddFriendModal";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export default function Friends() {
    const [addFriend, setAddFriend] = useState(false);
    return (
        <Layout>
            <div className="w-full h-12 rounded-b-lg bg-neutral-900 flex justify-between px-4 items-center font-bold">
                <h2>Friends</h2>
                <button onClick={() => setAddFriend(true)} className="text-blue-500 hover:text-blue-600"><PlusCircleIcon/></button>
                {addFriend && <AddFriendModal set={setAddFriend} show={addFriend}/>}
            </div>
        </Layout>
    )
}