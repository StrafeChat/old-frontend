import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/context/ClientContext";

export const metadata: Metadata = {
  title: "StrafeChat",
  description: "Start chatting today on strafe.chat!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <div className="w-screen h-screen">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
