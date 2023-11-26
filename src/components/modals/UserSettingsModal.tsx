import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import SettingsList from "../SettingsList";
import { useClient } from "@/context/ClientContext";
import { PencilIcon, XSquare } from "lucide-react";
import { Client } from "strafe.js";
import Image from "next/image";
import { Button } from "../ui/button";

export default function UserSettingsModal({
  show,
  set,
}: {
  show: boolean;
  set: Dispatch<SetStateAction<boolean>>;
}) {
  const [isBrowser, setIsBrowser] = useState(false);
  const { client } = useClient();
  const [currentSetting, setCurrentSetting] = useState("account");

  useEffect(() => {
    setIsBrowser(true);

    if (typeof window != "undefined") {
      setTimeout(() => {
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") set(false);
        });
      }, 1000);
    }
  }, [set]);

  return (
    <div className="modal-overlay">
      <SettingsList
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
      />
      <form className="full" onSubmit={(event) => event.preventDefault()}>
        <header>
          <XSquare
            onClick={() => set(false)}
            className="absolute top-3 right-3 cursor-pointer hover:text-red-500 rounded-sm"
          />
        </header>
        <div className="body">
          {currentSetting == "account" && <AccountSettings client={client!} />}
        </div>
      </form>
    </div>
  );
}

function AccountSettings({ client }: { client: Client }) {
  const [viewEmail, setEmail] = useState<any>({});
  const [avatar, setAvatar] = useState<string | null>(null);
  const [view, setView] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [editable, setEditable] = useState({
    displayName: false,
    username: false,
    tag: false,
    email: false,
  });

  useEffect(() => {
    const secure = `${"*".repeat(
      client?.user?.email?.split("@")[0].length as number
    )}@${client?.user?.email?.split("@")[1]}`;

    setEmail({ secure: secure, email: client?.user?.email });
    setAvatar(client.user?.avatar!);
  }, [client?.user?.email, client.user?.avatar, setEmail]);

  useEffect(() => {
    if (avatar != null && avatar != client.user?.avatar) setUpdated(true);
    else setUpdated(false);
  }, [avatar, client.user?.avatar]);

  return (
    <>
      {updated && <Button className="absolute right-3 bottom-3">Save</Button>}
      <h1>Account</h1>
      <ul>
        <li className="w-[800px]">
          <div className="w-full h-24 mt-4 relative">
            <div className="w-full h-full group">
              {client?.user?.banner ? (
                <div
                  style={{ background: client.user.avatar! }}
                  className="w-full h-full rounded-t-xl"
                />
              ) : (
                <div
                  style={{ backgroundColor: client?.user?.accentColor }}
                  className="w-full h-full rounded-t-xl"
                ></div>
              )}
              <PencilIcon className="absolute top-3 right-3 w-6 h-6 hidden group-hover:block hover:bg-white hover:text-black p-0.5 rounded-md" />
            </div>

            <div className="flex mx-4 group">
              <div className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] bg-black w-20 h-20" />
              <Image
                width={80}
                height={80}
                style={{ objectFit: "cover", width: "80px", height: "80px" }}
                src={`${avatar ? avatar : ""}`}
                className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] group-hover:opacity-75"
                alt="profile picture"
              />
              <input
                className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] w-20 h-20 opacity-0 cursor-pointer"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(event) => {
                  if (event.target.files) {
                    let reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    reader.onload = (a) => {
                      setAvatar(a.target?.result?.toString()!);
                    };
                  }
                }}
              />
              {client.user?.avatar != avatar && (
                <Button
                  onClick={() => setAvatar(client.user?.avatar!)}
                  className="absolute top-[4rem] left-[4rem] rounded-full w-8 h-8"
                >
                  X
                </Button>
              )}
            </div>
            <p className="absolute left-[7rem] top-[6.5rem]">
              {client?.user?.username!}#{client?.user?.tag!}
            </p>
          </div>
          <div
            style={{ padding: "10px", height: "18rem" }}
            className="w-full bg-[#1E1F22] rounded-b-lg"
          >
            <div
              style={{ marginTop: "44px", height: "14rem" }}
              className="w-full bg-[#2B2D31] rounded-lg"
            >
              <p
                className={`font-bold ${
                  editable.displayName ? "text-green-500" : "text-[#E4E0E0]"
                }`}
                style={{
                  paddingLeft: "1.5%",
                  paddingTop: "1.5%",
                  fontSize: "10px",
                }}
              >
                Display Name
              </p>
              <div className="flex mx-4 justify-between">
                <input
                  readOnly={!editable.displayName}
                  style={{
                    paddingTop: "0.3%",
                    fontSize: "12px",
                    color: "#E4E0E0",
                  }}
                  value={client?.user?.displayName!}
                  placeholder="empty"
                />
                <button
                  onClick={() => {
                    setEditable({
                      ...editable,
                      displayName: !editable.displayName,
                    });
                  }}
                  style={{ fontSize: "14px", color: "#C2BFBF", width: "3rem" }}
                  className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F]"
                >
                  Edit
                </button>
              </div>

              <p
                className={`font-bold ${
                  editable.username ? "text-green-500" : "text-[#E4E0E0]"
                }`}
                style={{
                  paddingLeft: "1.5%",
                  paddingTop: "1.5%",
                  fontSize: "10px",
                }}
              >
                Username
              </p>
              <div className="flex mx-4 justify-between">
                <input
                  readOnly={!editable.username}
                  style={{
                    paddingTop: "0.3%",
                    fontSize: "12px",
                    color: "#E4E0E0",
                  }}
                  value={client?.user?.username!}
                />
                <button
                  onClick={() =>
                    setEditable({ ...editable, username: !editable.username })
                  }
                  style={{ fontSize: "14px", color: "#C2BFBF", width: "3rem" }}
                  className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] "
                >
                  Edit
                </button>
              </div>

              <p
                className={`font-bold ${
                  editable.tag ? "text-green-500" : "text-[#E4E0E0]"
                }`}
                style={{
                  paddingLeft: "1.5%",
                  paddingTop: "1%",
                  fontSize: "10px",
                }}
              >
                Tag
              </p>
              <div className="flex mx-4 justify-between">
                <div className="bg-[var(--input)] outline-none rounded-md flex items-center">
                  <span
                    style={{
                      paddingTop: "0.3%",
                      fontSize: "12px",
                      color: "#E4E0E0",
                    }}
                    className="pl-2"
                  >
                    #
                  </span>
                  <input
                    readOnly={!editable.tag}
                    style={{
                      paddingTop: "1%",
                      fontSize: "12px",
                      color: "#E4E0E0",
                    }}
                    value={client?.user?.tag!}
                  />
                </div>
                <button
                  onClick={() =>
                    setEditable({ ...editable, tag: !editable.tag })
                  }
                  style={{ fontSize: "14px", color: "#C2BFBF", width: "3rem" }}
                  className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] "
                >
                  Edit
                </button>
              </div>

              <p
                className={`font-bold ${
                  editable.email ? "text-green-500" : "text-[#E4E0E0]"
                }`}
                style={{
                  paddingLeft: "1.5%",
                  paddingTop: "1%",
                  fontSize: "10px",
                }}
              >
                Email
              </p>
              <div className="flex mx-4 justify-between">
                <div className="flex gap-2">
                  <input
                    readOnly={!editable.email}
                    style={{
                      paddingTop: "0.3%",
                      fontSize: "12px",
                      color: "#E4E0E0",
                    }}
                    value={view ? viewEmail?.email! : viewEmail?.secure!}
                  />
                  <a
                    className={`${
                      editable.email ? "text-red-500" : "text-[#009CC8]"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => !editable.email && setView(!view)}
                  >
                    {view ? "Hide" : "Reveal"}
                  </a>
                </div>
                <button
                  onClick={() => {
                    setEditable({ ...editable, email: !editable.email });
                    setView(true);
                  }}
                  style={{ fontSize: "14px", color: "#C2BFBF", width: "3rem" }}
                  className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] "
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
