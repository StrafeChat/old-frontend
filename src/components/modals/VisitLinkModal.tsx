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

export default function VisitLinkModal({
  show,
  set,
  link,
}: {
  show: boolean;
  set: Dispatch<
    SetStateAction<{
      link: string;
      show: boolean;
    }>
  >;
  link: string;
}) {
  const [isBrowser, setIsBrowser] = useState(false);
  const { client } = useClient();

  useEffect(() => {
    setIsBrowser(true);

    if (typeof window != "undefined") {
      setTimeout(() => {
        document.addEventListener("click", (event) => {
          if ((event.target as any).id === "backdrop")
            set({ link: "", show: false });
        });
      }, 1000);

      setTimeout(() => {
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") set({ link: "", show: false });
        });
      }, 1000);
    }
  }, [set]);

  return (
    <div
      id="backdrop"
      className="absolute w-full h-full left-0 top-0 bg-[rgba(0,0,0,0.75)] z-[999] flex flex-col justify-center items-center"
    >
      <div className="p-4 bg-neutral-900 flex flex-col gap-2 rounded-lg">
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-center">
            Are you sure you want to go to{" "}
            <span className="bg-black p-1 rounded-full">{link}</span>
          </p>
          <a
            href={link}
            onClick={() => set({ link: "", show: false })}
            target="_blank"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
}
