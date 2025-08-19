'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

import '@excalidraw/excalidraw/index.css';

import { useUIStore } from '@/app/stores/ui-store';
import { useDrawingStore } from '@/app/stores/drawing-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/shadcn/dialog';
import { Button } from '@/app/components/shadcn/button';
import { toast } from 'sonner';

const ExcalidrawEditor = dynamic(() => import('@excalidraw/excalidraw').then(mod => mod.Excalidraw), { ssr: false });

export function Excalidraw() {
    const { excalidraw, setExcalidraw } = useUIStore();
    const { getSelectedDrawing, setSelectedDrawingId, addDrawing } = useDrawingStore();
    const { resolvedTheme } = useTheme();

    const [drawingName, setDrawingName] = useState('');
    const [excalidrawData, setExcalidrawData] = useState<any>(null);

    const selectedDrawing = getSelectedDrawing();

    useEffect(() => {
        if (selectedDrawing) {
            setDrawingName(selectedDrawing.name);
            try {
                setExcalidrawData(JSON.parse(selectedDrawing.url));
            } catch {
                setExcalidrawData(null);
            }
        } else {
            setDrawingName('');
            setExcalidrawData(null);
        }
    }, [selectedDrawing]);

    const handleSave = () => {
        if (!drawingName.trim() || !excalidrawData) return;

        addDrawing(drawingName.trim(), JSON.stringify(excalidrawData));
        setDrawingName('');
        setExcalidrawData(null);

        toast.success('Saved excalidraw', {
            description: `Excalidraw: ${drawingName.trim()}`,
        });
    };

    const handleClose = () => {
        setExcalidraw(false);
        setSelectedDrawingId(null);
    };

    const handleChange = useCallback((elements: any, appState: any) => {
        setExcalidrawData({ elements, appState });
    }, []);

    const initialData = excalidrawData
        ? {
              elements: excalidrawData.elements || [],
              appState: {
                  ...excalidrawData.appState,
                  collaborators: new Map(),
                  theme: resolvedTheme === 'dark' ? 'dark' : 'light',
              },
              scrollToContent: true,
          }
        : undefined;

    return (
        <Dialog open={excalidraw} onOpenChange={handleClose}>
            <DialogContent className="flex h-[90vh] w-[90vw] max-w-none flex-col p-0">
                <DialogHeader className="mb-2 shrink-0 pl-6 pr-6 pt-6">
                    <DialogTitle className="mb-2">Excalidraw</DialogTitle>
                    <div className="mt-6 flex gap-2">
                        <input
                            type="text"
                            placeholder="Drawing name"
                            value={drawingName}
                            onChange={e => setDrawingName(e.target.value)}
                            className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
                        />
                        <Button
                            onClick={handleSave}
                            disabled={!drawingName.trim() || !excalidrawData}
                            variant="secondary"
                        >
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <div className="min-h-0 flex-1 p-6 pt-0">
                    <ExcalidrawEditor 
                        initialData={initialData} 
                        onChange={handleChange}
                        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
