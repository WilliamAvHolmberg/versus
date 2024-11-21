import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { AuthProvider } from "../src/contexts/auth";
import { getSession } from "../src/actions/auth";
import "./globals.css";
import { SettingsDrawer } from "../src/components/settings/SettingsDrawer";
import { FeedbackModal } from "../src/components/feedback/FeedbackModal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pagepin",
  description: "Save and organize your bookmarks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <head>
        <Script async src="https://platform.twitter.com/widgets.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider initialUser={session?.user ?? null}>
          {children}
          <SettingsDrawer />
          <FeedbackModal />
        </AuthProvider>
      </body>
    </html>
  );
}
