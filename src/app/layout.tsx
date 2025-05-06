import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reflexão do Dia",
  description: "Reflexão diária com temas bíblicos e psicológicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#4CAF50" />
  <meta name="description" content="Reflexão diária com temas bíblicos e psicológicos." />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="icon" href="/icon-512x512.png" sizes="512x512" type="image/png" />
</Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
