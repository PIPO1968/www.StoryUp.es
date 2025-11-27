"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { I18nProvider } from "@/utils/i18n";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setShowSidebar(true);
          } else {
            setShowSidebar(false);
          }
        } else {
          setShowSidebar(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setShowSidebar(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <html lang="es">
        <head>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <title>StoryUp</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-green-100`}>
          <I18nProvider>
            <Header />
            <main className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p>Cargando...</p>
              </div>
            </main>
          </I18nProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>StoryUp</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-green-100`}>
        <I18nProvider>
          <Header />
          {showSidebar && <Sidebar />}
          <main>{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
