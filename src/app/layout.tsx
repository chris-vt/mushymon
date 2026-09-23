import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Mushymon",
  description: "Mushroom foraging logbook",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mushymon",
  },
  icons: {
    apple: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f344.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className="font-sans min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
