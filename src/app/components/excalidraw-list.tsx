'use client';

import { useUIStore } from '@/app/stores/ui-store';
import { useDrawingStore } from '@/app/stores/drawing-store';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/app/components/shadcn/command';
import { Button } from '@/app/components/shadcn/button';

export function ExcalidrawList() {
    const { drawings, setDrawings, setExcalidraw } = useUIStore();
    const { setSelectedDrawingId, getDrawings, removeDrawing } = useDrawingStore();
    const savedDrawings = getDrawings();

    const handleOpenDrawing = (drawingId: string) => {
        setSelectedDrawingId(drawingId);
        setExcalidraw(true);
        setDrawings(false);
    };

    const handleDeleteDrawing = (drawingId: string) => {
        removeDrawing(drawingId);
    };

    return (
        <CommandDialog open={drawings} onOpenChange={setDrawings}>
            <CommandInput placeholder="Search drawings..." />

            <CommandList>
                {savedDrawings.length === 0 ? (
                    <CommandEmpty>No drawings found.</CommandEmpty>
                ) : (
                    <CommandGroup heading={`Drawings (${savedDrawings.length})`}>
                        {savedDrawings.map(drawing => (
                            <div
                                key={drawing.id}
                                className="mb-3 flex items-center justify-between rounded-md border border-border p-3"
                            >
                                <div
                                    className="flex min-w-0 flex-1 cursor-pointer flex-col space-y-1"
                                    onClick={() => handleOpenDrawing(drawing.id)}
                                >
                                    <span className="truncate font-medium text-foreground">
                                        <span className="text-lg">🎨</span> {drawing.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Created {new Date(drawing.created).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="ml-4 flex gap-2">
                                    <Button
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleOpenDrawing(drawing.id);
                                        }}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Open
                                    </Button>

                                    <Button
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleDeleteDrawing(drawing.id);
                                        }}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}
