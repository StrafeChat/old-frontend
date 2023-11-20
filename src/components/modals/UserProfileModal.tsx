import { Dispatch,
     SetStateAction,
     useEffect,
     useState,
} from "react";
import Image from "next/image";

export default function UserProfileModal({
    show,
    set,
    user
    }: {
    show: boolean;
    set: Dispatch<SetStateAction<boolean>>;
    user: object | null;
}) {
    const [isBrowser, setIsBrowser] = useState(false);
    console.log(user)

    useEffect(() => {
        setIsBrowser(true);
    if (typeof window != "undefined") {
        setTimeout(() => {
          document.addEventListener("click", (event) => {
            if ((event.target as any).id === "backdrop")
                set(false)
        });
        }, 1000);
  
        setTimeout(() => {
          document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") set(false);
            console.log("hi")
          });
        }, 1000);
      }
    }, [set]);

    if (!show) {
        return null;
      }

    return (
        <div>
        <h2>USER PROFILE</h2>
      </div>
);
}