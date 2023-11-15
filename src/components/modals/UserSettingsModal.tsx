import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import SettingsList from "../SettingsList";
import { useClient } from "@/context/ClientContext";
import { PencilIcon, XSquare } from "lucide-react";
import { Client } from "strafe.js";

export default function UserSettingsModal({ show, set }: { show: boolean, set: Dispatch<SetStateAction<boolean>> }) {
    const [isBrowser, setIsBrowser] = useState(false);
    const { client } = useClient();
    const [currentSetting, setCurrentSetting] = useState("account");

    useEffect(() => {
        setIsBrowser(true);

        if (typeof window != 'undefined') {
            setTimeout(() => {
                document.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") set(false);
                })
            }, 1000);
        }
    }, [set]);

    return (
        <div role="modal">
            <SettingsList currentSetting={currentSetting} setCurrentSetting={setCurrentSetting} />
            <div className="main-wrapper overflow-hidden p-4 relative bg-stone-900">
                <XSquare onClick={() => set(false)} className="absolute top-3 right-3 cursor-pointer hover:text-red-500 rounded-sm" />
                {/* <button onClick={() => set(false)} className="absolute top-3 right-3 p-1 rounded-lg bg-[rgba(255,255,255,0.5)]">Back</button> */}
                {currentSetting == "account" && <AccountSettings client={client!} />}
            </div>
        </div>)
}


function AccountSettings({ client }: { client: Client }) {
    const imageRef = useRef<HTMLImageElement>(null);
    const [viewEmail, setEmail] = useState<any>({})
    const [view, setView] = useState(false);

    const [editable, setEditable] = useState({
        displayName: false,
        username: false,
        tag: false,
        email: false,
    });

    useEffect(() => {
        const secure = `${"*".repeat(client?.user?.email?.split("@")[0].length as number)}@${client?.user?.email?.split("@")[1]}`;

        setEmail({ secure: secure, email: client?.user?.email });
    }, [client?.user?.email, setEmail]);

    return (
        <>
            <h1>Account</h1>
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                <div className="w-[800px]">
                    <div className="w-full h-24 mt-4 relative">
                        <div className="w-full h-full group">
                            {client?.user?.banner ? <div style={{ background: client.user.avatar! }} className="w-full h-full rounded-t-xl" /> : <div style={{ backgroundColor: client?.user?.accentColor }} className="w-full h-full rounded-t-xl"></div>}
                            <PencilIcon className="absolute top-3 right-3 w-4 h-4 hidden group-hover:block" />
                        </div>

                        <div className="flex mx-4 group">
                            <div className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] bg-black w-20 h-20" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img ref={imageRef} src={client?.user?.avatar!} className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] w-20 h-20 group-hover:opacity-75" alt="test" />
                            <input className="absolute top-[4rem] rounded-full border-4 border-[#1E1F22] w-20 h-20 opacity-0 cursor-pointer" type="file" accept="image/png, image/gif, image/jpeg" />
                        </div>
                        <p className="absolute left-[7rem] top-[6.5rem]">{client?.user?.username!}#{client?.user?.tag!}</p>
                    </div>
                    <div style={{ padding: '10px', height: '18rem' }} className="w-full bg-[#1E1F22] rounded-b-lg">
                        <div style={{ marginTop: '44px', height: '14rem' }} className="w-full bg-[#2B2D31] rounded-lg">
                            <p className={`font-bold ${editable.displayName ? "text-green-500" : "text-[#E4E0E0]"}`} style={{ paddingLeft: '1.5%', paddingTop: '1.5%', fontSize: '10px' }}>Display Name</p>
                            <div className="flex mx-4 justify-between">
                                <input readOnly={!editable.displayName} style={{ paddingTop: '0.3%', fontSize: '12px', color: '#E4E0E0' }} value={client?.user?.displayName!} placeholder="empty" />
                                <button onClick={() => { setEditable({ ...editable, displayName: !editable.displayName }) }} style={{ fontSize: '14px', color: '#C2BFBF', width: '3rem' }} className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F]">Edit</button>
                            </div>

                            <p className={`font-bold ${editable.username ? "text-green-500" : "text-[#E4E0E0]"}`} style={{ paddingLeft: '1.5%', paddingTop: '1.5%', fontSize: '10px' }}>Username</p>
                            <div className="flex mx-4 justify-between">
                                <input readOnly={!editable.username} style={{ paddingTop: '0.3%', fontSize: '12px', color: '#E4E0E0' }} value={client?.user?.username!} />
                                <button onClick={() => setEditable({ ...editable, username: !editable.username })} style={{ fontSize: '14px', color: '#C2BFBF', width: '3rem' }} className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] ">Edit</button>
                            </div>

                            <p className={`font-bold ${editable.tag ? "text-green-500" : "text-[#E4E0E0]"}`} style={{ paddingLeft: '1.5%', paddingTop: '1%', fontSize: '10px' }}>Tag</p>
                            <div className="flex mx-4 justify-between">
                                {/* < style={{ paddingTop: '0.3%', fontSize: '12px', color: '#E4E0E0' }}>#{client?.user?.tag}</> */}
                                <div className="bg-[var(--input)] outline-none rounded-md flex items-center">
                                    <span style={{ paddingTop: "0.3%", fontSize: "12px", color: "#E4E0E0" }} className="pl-2">#</span>
                                    <input readOnly={!editable.tag} style={{ paddingTop: '1%', fontSize: '12px', color: '#E4E0E0' }} value={client?.user?.tag!} />
                                </div>
                                <button onClick={() => setEditable({ ...editable, tag: !editable.tag })} style={{ fontSize: '14px', color: '#C2BFBF', width: '3rem' }} className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] ">Edit</button>
                            </div>

                            <p className={`font-bold ${editable.email ? "text-green-500" : "text-[#E4E0E0]"}`} style={{ paddingLeft: '1.5%', paddingTop: '1%', fontSize: '10px' }}>Email</p>
                            <div className="flex mx-4 justify-between">
                                <div className="flex gap-2">
                                    <input readOnly={!editable.email} style={{ paddingTop: '0.3%', fontSize: '12px', color: '#E4E0E0' }} value={view ? viewEmail?.email! : viewEmail?.secure!} />
                                    <a className={`${editable.email ? "text-red-500" : "text-[#009CC8]"}`} style={{ cursor: "pointer" }} onClick={() => !editable.email && setView(!view)}>{view ? "Hide" : "Reveal"}</a>
                                </div>
                                <button onClick={() => {
                                    setEditable({ ...editable, email: !editable.email });
                                    setView(true);
                                }} style={{ fontSize: '14px', color: '#C2BFBF', width: '3rem' }} className="p-1 rounded-lg bg-[#3C3C3C] hover:bg-[#504F4F] ">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}