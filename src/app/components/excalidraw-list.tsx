'use client';

import { useUIStore } from '@/app/stores/ui-store';
import { useDrawingStore } from '@/app/stores/drawing-store';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/app/components/shadcn/command';

export function ExcalidrawList() {
    const { drawings, setDrawings, setExcalidraw } = useUIStore();
    const { setSelectedDrawingId, getDrawings } = useDrawingStore();
    const savedDrawings = getDrawings();

    const handleOpenDrawing = (drawingId: string) => {
        setSelectedDrawingId(drawingId);
        setExcalidraw(true);
        setDrawings(false);
    };

    return (
        <CommandDialog open={drawings} onOpenChange={setDrawings}>
            <CommandInput placeholder="Search drawings..." />

            <CommandList>
                <CommandEmpty>No drawings found.</CommandEmpty>

                <CommandGroup heading={`Drawings (${savedDrawings.length})`}>
                    {savedDrawings.map(drawing => (
                        <CommandItem
                            key={drawing.id}
                            onSelect={() => handleOpenDrawing(drawing.id)}
                            className="mb-2 cursor-pointer p-3"
                        >
                            <div className="command-item-spacing">
                                <h3 className="command-heading text-base">
                                    <span className="text-lg">🎨</span> {drawing.name}
                                </h3>
                                <span className="command-description text-sm">
                                    Created {new Date(drawing.created).toLocaleDateString()}
                                </span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
