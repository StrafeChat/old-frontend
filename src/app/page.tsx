"use client";
import Layout from "@/components/Layout";
import { useClient } from "@/context/ClientContext";

export default function App() {
 const { client } = useClient();

  return (
    <Layout>
     <div className="w-full h-full">
                <div className="w-full h-12 rounded-b-lg bg-neutral-900 flex justify-between px-4 items-center font-bold">
                    <div className="flex items-center">
                    <h2>Home</h2>
                 </div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1><b>Welcome {client?.user?.displayName! || client?.user?.username!}!</b></h1>
                </div>
     </div>                 
    </Layout>
  );
}
