import { useClient } from "@/context/ClientContext";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function ChannelList({ currentSetting, setCurrentSetting }: { currentSetting: string, setCurrentSetting: Dispatch<SetStateAction<string>> }) {
  const { client } = useClient();
    
  return ( 
    <div className="channel-sidebar">
      <div className="w-full flex flex-col items-start" >
        <p className="font-bold" style={{ fontSize: '10px', paddingTop: '25%', paddingLeft: '26%', color: '#E4E0E0' }}>User Settings</p>
        <div className="w-full px-4 h-full flex flex-col">
          <button onClick={() => setCurrentSetting("account")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "account" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Account</button>
          <button onClick={() => setCurrentSetting("privacy")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "privacy" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Privacy</button>
          <button onClick={() => setCurrentSetting("connections")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "connections" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Connections</button>
          <button onClick={() => setCurrentSetting("requests")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "requests" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Requests</button>
        </div>
      </div>

      <div className="w-[100px] bg-gray-200 opacity-30" style={{ marginBottom: '-15px', height: '0.3px' }}></div>

      <div className="w-full flex flex-col items-start" style={{ marginTop: '10%' }}>
        <p className="font-bold" style={{ fontSize: '10px', paddingLeft: '26%', color: '#E4E0E0' }}>App Settings</p>
        <div className="w-full px-4 h-full flex flex-col">
          <button onClick={() => setCurrentSetting("appearance")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "appearance" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Appearance</button>
          <button onClick={() => setCurrentSetting("accessibility")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "accessibility" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Accessibility</button>
          <button onClick={() => setCurrentSetting("video-voice")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "video-voice" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Video & Voice</button>
          <button onClick={() => setCurrentSetting("notifications")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "notifications" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Notifications</button>
          <button onClick={() => setCurrentSetting("language")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "language" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Language</button>
          <button onClick={() => setCurrentSetting("advanced")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "advanced" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Advanced</button>
        </div>
      </div>

      <div className="w-[100px] bg-gray-200 opacity-30" style={{ marginBottom: '-13px', height: '0.3px' }}></div>

      <div className="w-full flex flex-col items-start" style={{ marginTop: '10%' }}>
        <p className="font-bold" style={{ fontSize: '10px', paddingLeft: '26%', color: '#E4E0E0' }}>Miscellaneous</p>
        <div className="w-full px-4 h-full flex flex-col">
          <button onClick={() => setCurrentSetting("activity")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "activity" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Activity</button>
          <button onClick={() => setCurrentSetting("recent-news")} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF', backgroundColor: `${currentSetting === "recent-news" ? 'rgba(255,255,255,0.1)' : ''}` }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Recent News</button>
        </div>
      </div>

      <div className="w-[100px] bg-gray-200 opacity-30" style={{ marginBottom: '-13px', height: '0.3px' }}></div>

      <div className="w-full flex flex-col items-start" style={{ marginTop: '10%' }}>
        <div className="w-full px-4 h-full flex flex-col">
          <Link href={"/logout"} style={{ paddingLeft: '22%', fontSize: '16px', color: '#C2BFBF' }} className="p-1 rounded-md hover:bg-[#3C3C3C] text-left">Logout</Link>
        </div>
      </div>

      <div className="w-[100px] bg-gray-200 opacity-30" style={{ marginTop: '7px', height: '0.3px' }}></div>
    </div>
  );
}
