import { useClient } from "@/context/ClientContext";
import LoadingScreen from "./LoadingScreen";
import GuildList from "./GuildList";
import ChannelList from "./ChannelList";

export default function Layout({ children }: { children: JSX.Element | never[] }) {
    const { client, ready, serverListPos } = useClient();

    if (!client || !ready) return <LoadingScreen />;
    return (
        <div className={`w-full h-full flex ${(serverListPos == "top" || serverListPos == "bottom") && "flex-col"}`}>
            {((serverListPos == "left" || serverListPos == "top") && <GuildList orientation={serverListPos == "left" ? "horizontal" : "vertical"} />)}
            <div className="w-full h-full flex">
                <ChannelList />
                <div className="main-wrapper">
                    {children}
                </div>
            </div>
            {((serverListPos == "right" || serverListPos == "bottom") && <GuildList orientation={serverListPos == "right" ? "horizontal" : "vertical"} />)}
        </div>)
}