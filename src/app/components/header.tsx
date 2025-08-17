'use client';

import { HelpCircle } from 'lucide-react';

import { useUIStore } from '@/app/stores/ui-store';
import { HelpModal } from '@/app/components/help-modal';

export function Header() {
    const { command, help, setCommand, setHelp } = useUIStore();

    const handleHelpClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHelp(true);
    };

    return (
        <>
            <div className="fill-container surface-secondary section-padding relative">
                <div className="flex justify-center">
                    <button onClick={() => setCommand(!command)} className="transition-opacity hover:opacity-80">
                        <h2 className="brand-subtitle">Mpad</h2>
                    </button>
                </div>

                <button
                    onClick={handleHelpClick}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform p-2 transition-opacity hover:opacity-80"
                    aria-label="Help"
                >
                    <HelpCircle className="h-5 w-5" />
                </button>
            </div>

            <HelpModal open={help} onOpenChange={setHelp} />
        </>
    );
}
