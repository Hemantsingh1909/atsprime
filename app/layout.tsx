import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { PHProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ATSPrime - Your Resume's AI Copilot",
  description: "Transform your resume with AI-powered optimization. Get real-time ATS scoring, cover letter generation, and professional insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.location.pathname === "/") {
                  if ("scrollRestoration" in history) {
                    history.scrollRestoration = "manual";
                  }
                  window.scrollTo(0, 0);
                }
              } catch (e) {}
            `,
          }}
        />
        <PHProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PHProvider>
      </body>
    </html>
  );
}
