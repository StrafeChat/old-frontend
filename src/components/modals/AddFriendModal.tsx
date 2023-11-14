import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useClient } from "@/context/ClientContext";

export default function AddFriendModal({
  show,
  set,
}: {
  show: boolean;
  set: Dispatch<SetStateAction<boolean>>;
}) {
  const [isBrowser, setIsBrowser] = useState(false);
  const { client } = useClient();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setIsBrowser(true);

    if (typeof window != "undefined") {
      setTimeout(() => {
        document.addEventListener("click", (event) => {
          if ((event.target as any).id === "backdrop") set(false);
        });
      }, 1000);

      setTimeout(() => {
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") set(false);
        });
      }, 1000);
    }
  }, [set]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = query.split("#");
    client?.addFriend(result[0], result[1]);
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event)}
      id="backdrop"
      className="absolute w-full h-full left-0 top-0 bg-[rgba(0,0,0,0.75)] z-[999] flex flex-col justify-center items-center"
    >
      <div className="py-32 px-32 p-4 bg-slate-900 flex flex-col gap-2 rounded-lg">
        <div className="flex-grow flex items-center justify-center">
          <h2 className="font-semibold text-3xl text-center">Add Friend</h2>
          
            <Input/>
         
        </div>
      </div>
    </form>
  );
}
