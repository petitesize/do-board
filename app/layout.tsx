import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
// 전역 CSS
import "@/styles/globals.css";
import "@/styles/main.scss";

import SideNavigation from "@/components/common/navigation/SideNavigation";
import { Toaster } from "@/components/ui";

const NOTO_SANS_KR = Noto_Sans_KR({ subsets: ["latin"] });
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Do-Board",
  description: "Do-Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${NOTO_SANS_KR.className} antialiased`}>
        <div className="page">
          <SideNavigation />
          <main className="page__main">{children}</main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
