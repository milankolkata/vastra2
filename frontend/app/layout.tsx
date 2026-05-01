import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vastra AI – Ethnic Wear Sales Intelligence",
  description: "Upload your sales data and get actionable insights, demand forecasts, and festival opportunities for your ethnic wear store.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-orange-50/20">
        {children}
      </body>
    </html>
  );
}
