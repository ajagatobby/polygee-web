import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/lib/auth-context";
import { SearchProvider } from "@/lib/search-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Polygee - AI Soccer Predictions",
    template: "%s | Polygee",
  },
  description:
    "AI-powered soccer predictions across 30+ leagues. Get match analysis, injury reports, and value bets powered by machine learning.",
  openGraph: {
    title: "Polygee - AI Soccer Predictions",
    description:
      "AI-powered soccer predictions across 30+ leagues. Get match analysis, injury reports, and value bets.",
    type: "website",
    siteName: "Polygee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polygee - AI Soccer Predictions",
    description:
      "AI-powered soccer predictions across 30+ leagues.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1552f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
