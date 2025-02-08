import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Versus - Compare AI Models ",
  description: "Versus is a tool that helps you compare AI models. You give it a prompt, select the models you want to compare, and it will generate a list of results for you to compare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
