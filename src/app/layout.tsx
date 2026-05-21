import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Bannawit Chaichomphu — Portfolio",
  description: "Computer Engineer & Web Developer. Fresh graduate from Rangsit University.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Bannawit Chaichomphu — Portfolio",
    description: "Computer Engineer & Web Developer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}