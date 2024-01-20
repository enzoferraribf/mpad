import type { Metadata } from 'next';

import { JetBrains_Mono } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from '@/app/components/sonner';

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
        <html lang="en">
            <body className={font.className}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
