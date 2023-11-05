import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddFriendModal({ show, set }: { show: boolean, set: Dispatch<SetStateAction<boolean>> }) {
    const [isBrowser, setIsBrowser] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setIsBrowser(true);

        if (typeof window != 'undefined') {
            setTimeout(() => {
                document.addEventListener("click", (event) => {
                    if ((event.target as any).id === "backdrop") set(false);
                })
            }, 1000);

            setTimeout(() => {
                document.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") set(false);
                })
            }, 1000);
        }
    }, [set]);

    const handleSubmit = () => {

    }

    return (
        <form onSubmit={(event) => event.preventDefault()} id="backdrop" className="absolute w-full h-full left-0 top-0 bg-[rgba(0,0,0,0.75)] z-[999] flex justify-center items-center">
            <div className="w-64 p-4 bg-stone-900 flex flex-col gap-2 rounded-lg">
                <h2>Add Friend</h2>
                <Input placeholder="username#9999" type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
                <div className="flex justify-end gap-2">
                    <Button onClick={() => set(false)} className="bg-stone-800 p-1 rounded-lg">Cancel</Button>
                    <Button onClick={() => handleSubmit()} className="bg-stone-800 p-1 rounded-lg">Send</Button>
                </div>
            </div>
        </form>
    )
}