import type { Metadata } from 'next';

import { JetBrains_Mono } from 'next/font/google';

import './globals.css';

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
        <html lang="en" className="bg-[#1e1e1e]">
            <body className={font.className}>{children}</body>
        </html>
    );
}
