import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react"
import { Inter } from "next/font/google";
import "./globals.css";
import '@radix-ui/themes/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Hydeout Website",
  description: "A website created by ihyd.xyz for the Hydeout Discord server",
};

import { ThemeProvider } from "@/app/components/theme-provider";
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}