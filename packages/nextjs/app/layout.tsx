import type { Metadata } from "next";
import { Providers } from "~~/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawDex - AI-Governed Base Ecosystem Index",
  description: "Deposit USDC for diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cool">
      <body className="min-h-screen bg-base-100 text-base-content">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}