import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/context/ClientContext";

export const metadata: Metadata = {
  title: "Strafe Chat",
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
          <div>{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
