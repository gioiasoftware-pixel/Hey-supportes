import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://heyrestaurant.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HEY Supporters",
  description: "Il programma referral di HEY: invita un amico, ottieni uno sconto.",
  openGraph: {
    title: "HEY Supporters",
    description: "Il programma referral di HEY: invita un amico, ottieni uno sconto.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
