import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ThemeProvider } from '@/app/components/shadcn/theme-provider';
import { Toaster } from '@/app/components/shadcn/sonner';

import { IRootLayout } from '@/app/models/layout';

import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
    title: 'Mpad',
    description: 'Create collaborative notes on the fly',
};

export default function RootLayout({ children }: IRootLayout) {
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

                <meta
                    property="og:image"
                    content="https://firebasestorage.googleapis.com/v0/b/missopad-e13a9.appspot.com/o/logo.png?alt=media"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="256" />
                <meta property="og:image:height" content="256" />
            </head>

            <body className={`${geistSans.className} ${geistMono.variable}`}>
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
