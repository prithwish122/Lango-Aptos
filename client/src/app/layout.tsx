import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ReactQueryProvider } from "@/app/components/ReactQueryProvider";
import { WalletProvider } from "@/app/components/WalletProvider";
import { Toaster } from "@/app/components/ui/toaster";
import { WrongNetworkAlert } from "@/app/components/WrongNetworkAlert";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Lango",
  title: "NextJS Boilerplate Template",
  description: "Aptos Boilerplate Template",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
