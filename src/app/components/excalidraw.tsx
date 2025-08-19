'use client';

import { useState, useEffect } from 'react';

import { useUIStore } from '@/app/stores/ui-store';
import { useDrawingStore } from '@/app/stores/drawing-store';
import { isValidExcalidrawUrl } from '@/lib/excalidraw-validator';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/shadcn/dialog';
import { Button } from '@/app/components/shadcn/button';
import { toast } from 'sonner';

export function Excalidraw() {
    const { excalidraw, setExcalidraw } = useUIStore();
    const { getSelectedDrawing, setSelectedDrawingId, addDrawing } = useDrawingStore();

    const [drawingName, setDrawingName] = useState('');
    const [drawingUrl, setDrawingUrl] = useState('');
    const [inputUrl, setInputUrl] = useState('');

    const selectedDrawing = getSelectedDrawing();

    useEffect(() => {
        if (selectedDrawing) {
            setDrawingName(selectedDrawing.name);
            setDrawingUrl(selectedDrawing.url);
            setInputUrl('');
        }
    }, [selectedDrawing]);

    const handleSave = () => {
        const urlToSave = inputUrl.trim() || drawingUrl.trim();
        if (drawingName.trim() && urlToSave) {
            if (!isValidExcalidrawUrl(urlToSave)) {
                toast.error("That's not the correct link!");
                return;
            }

            addDrawing(drawingName.trim(), urlToSave);
            setDrawingName('');
            setDrawingUrl('');
            setInputUrl('');

            toast.success('Saved excalidraw', {
                description: `Excalidraw: ${drawingName.trim()}`,
            });
        }
    };

    const handleClose = () => {
        setExcalidraw(false);
        setSelectedDrawingId(null);
    };

    const currentUrl = selectedDrawing?.url || drawingUrl || 'https://excalidraw.com';

    return (
        <Dialog open={excalidraw} onOpenChange={handleClose}>
            <DialogContent className="flex h-[80vh] w-[80vw] max-w-none flex-col p-0">
                <DialogHeader className="mb-2 shrink-0 pl-6 pr-6 pt-6">
                    <DialogTitle className="mb-2">Excalidraw</DialogTitle>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Drawing name"
                            value={drawingName}
                            onChange={e => setDrawingName(e.target.value)}
                            className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
                        />
                        <input
                            type="url"
                            placeholder="Excalidraw shareable link"
                            value={inputUrl}
                            onChange={e => setInputUrl(e.target.value)}
                            className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
                        />
                        <Button
                            onClick={handleSave}
                            disabled={!drawingName.trim() || (!inputUrl.trim() && !drawingUrl.trim())}
                            variant="secondary"
                            className="sm:w-auto"
                        >
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <div className="min-h-0 flex-1 p-6 pt-0">
                    <iframe
                        src={currentUrl}
                        className="h-full w-full rounded-md border-0"
                        title="Excalidraw Canvas"
                        allow="clipboard-read; clipboard-write"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
