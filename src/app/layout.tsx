import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Basaegochi - Pet Game",
    description: "Raise your digital pet on Base blockchain",
    openGraph: {
        title: "Basaegochi - Pet Game",
        description: "Raise your digital pet, battle other players, and earn rewards on Base blockchain",
        images: [{
            url: "https://basaegochi.vercel.app/splash.png",
            width: 1200,
            height: 630,
        }],
    },
    other: {
        "fc:miniapp": JSON.stringify({
            version: "1",
            imageUrl: "https://basaegochi.vercel.app/splash.png",
            button: {
                title: "Play Now",
                action: {
                    type: "launch_miniapp",
                    url: "https://basaegochi.vercel.app",
                    name: "Basaegochi",
                    splashImageUrl: "https://basaegochi.vercel.app/splash.png",
                    splashBackgroundColor: "#0052FF"
                }
            }
        }),
        "fc:frame": JSON.stringify({
            version: "1",
            imageUrl: "https://basaegochi.vercel.app/splash.png",
            button: {
                title: "Play Now",
                action: {
                    type: "launch_frame",
                    url: "https://basaegochi.vercel.app",
                    name: "Basaegochi",
                    splashImageUrl: "https://basaegochi.vercel.app/splash.png",
                    splashBackgroundColor: "#0052FF"
                }
            }
        })
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
