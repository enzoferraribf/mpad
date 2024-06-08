import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { JetBrains_Mono } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/app/components/shadcn/theme-provider';
import { Toaster } from '@/app/components/shadcn/sonner';

const font = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Mpad',
    description: 'Create collaborative notes on the fly',
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="favicon.ico" />

                <meta charSet="UTF-8" />
                <meta name="description" content="Share and update documents in real-time" />
                <meta name="keywords" content="pad, missopad, dontpad, document, notes, mpad" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:site_name" content="Mpad" />
                <meta property="og:title" content="Mpad" />
                <meta property="og:description" content="Share and update documents in real-time" />

                <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/missopad-e13a9.appspot.com/o/logo.png?alt=media" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="256" />
                <meta property="og:image:height" content="256" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet" />
            </head>

            <body className={font.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                    <Toaster />
                    <Analytics />
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    );
}
