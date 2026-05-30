import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/shared/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aquabooth",
  description: "A fun aquarium-themed photo booth. Take photos, add stickers, and download your custom photo strip!",
  keywords: ["photo booth", "aquabooth", "aquarium", "photo strip", "stickers", "nayadesigns"],
  authors: [{ name: "nayadesigns" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Aquabooth",
    description: "Take photos, add stickers, and download your custom aquarium photo strip!",
    url: "https://aquabooth-nayadesigns.vercel.app",
    siteName: "aquabooth.nayadesigns",
    images: [
      {
        url: "https://aquabooth-nayadesigns.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aquabooth preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquabooth",
    description: "Take photos, add stickers, and download your custom aquarium photo strip!",
    images: ["https://aquabooth-nayadesigns.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><PageTransition>{children}</PageTransition></body>
    </html>
  );
}
