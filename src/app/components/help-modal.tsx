'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/shadcn/dialog';
import { Badge } from '@/app/components/shadcn/badge';

import { IHelpModal } from '@/app/models/help-modal';

export function HelpModal({ open, onOpenChange }: IHelpModal) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Mpad Help</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">About Mpad</h3>
                        <p className="text-sm text-muted-foreground">Mpad is a collaborative markdown editor with real-time previews. All changes are synced through WebRTC and persisted to ensure your documents are always available.</p>
                    </div>

                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Getting Started</h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                            Open the command palette by clicking on the <strong>Mpad</strong> logo in the header or use the keyboard shortcut below.
                        </p>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">Ctrl + ,</Badge>
                            <span className="text-sm">Open Command Palette</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Available Commands</h3>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Files</h4>
                                <div className="ml-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">📁 Explorer</span>
                                            <Badge variant="secondary">Ctrl + .</Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground">View file structure. You can create folders by using nested paths like /mpad/foo</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">📤 Upload File</span>
                                        <span className="text-xs text-muted-foreground">Upload files. they will only live while people are in the pad.</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">🗄️ Storage</span>
                                            <Badge variant="secondary">Ctrl + ;</Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground">View uploaded files</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Layout</h4>
                                <div className="ml-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">✏️ Editor</span>
                                        <span className="text-xs text-muted-foreground">Edit-only view</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">📄 Preview</span>
                                        <span className="text-xs text-muted-foreground">Preview-only view</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">✏️📄 Editor+Preview</span>
                                        <span className="text-xs text-muted-foreground">Default split view</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Themes</h4>
                                <div className="ml-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">🌙 Dark</span>
                                        <span className="text-xs text-muted-foreground">Switch to dark mode</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">☀️ Light</span>
                                        <span className="text-xs text-muted-foreground">Switch to light mode</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
