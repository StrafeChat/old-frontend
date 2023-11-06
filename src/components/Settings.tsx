import { useClient } from "@/context/ClientContext";
import LoadingScreen from "./LoadingScreen";
import SettingsList from "./SettingsList";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from 'next/navigation'


export default function Settings({ children, currentSetting, setCurrentSetting }: { children: JSX.Element[] | JSX.Element | never[], currentSetting: string, setCurrentSetting: Dispatch<SetStateAction<string>> }) {
    const { client, ready } = useClient();
    const router = useRouter();
    if (!client || !ready) return <LoadingScreen />;

    return (
        <div className="w-full h-full flex bg-[black]">
            <SettingsList currentSetting={currentSetting} setCurrentSetting={setCurrentSetting} />
            <div className="main-wrapper overflow-hidden p-4 relative">
                <button onClick={() => router.back()} className="absolute top-3 right-3 p-1 rounded-lg bg-[rgba(255,255,255,0.5)]">Back</button>
                {children}
            </div>
        </div>)
}