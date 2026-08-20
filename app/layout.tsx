import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://detailing-center.grumps-soils-2qv8m61.chatgpt.site"),
  title: "DplusD Detailing Center — детейлинг автомобилей в Москве",
  description:
    "Детейлинг кузова и салона в Москве: полировка, химчистка, керамика, оклейка плёнкой и восстановление деталей.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "DplusD Detailing Center — Москва",
    description: "Детейлинг без компромиссов. Кузов, салон, защита и восстановление.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DplusD Detailing Center" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DplusD Detailing Center — Москва",
    description: "Детейлинг без компромиссов.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
