'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/shadcn/dialog';
import { Badge } from '@/app/components/shadcn/badge';
import { ExternalLink } from 'lucide-react';

import { IHelpModal } from '@/app/models/help-modal';

export function HelpModal({ open, onOpenChange }: IHelpModal) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Instructions</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">What is Mpad?</h3>
                        <p className="text-sm text-muted-foreground">
                            Mpad is a collaborative markdown editor with real-time previews. All changes are synced through WebRTC and persisted to ensure your documents are always available.{' '}
                            <a
                                href="https://github.com/enzoferraribf/mpad"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 align-baseline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Mpad Github
                            </a>
                        </p>
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
                                        <span className="text-xs text-muted-foreground">View file structure. Create folders by using paths like /mpad/foo</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">📤 Upload File</span>
                                        <span className="text-xs text-muted-foreground">Upload files. They will only live while people are in the pad</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">🗄️ Storage</span>
                                            <Badge variant="secondary">Ctrl + ;</Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground">View uploaded files</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">📄 Export PDF</span>
                                        <span className="text-xs text-muted-foreground">Export current document as PDF</span>
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

                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Markdown Syntax</h3>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Headers</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs"># Header 1</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">## Header 2</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">### Header 3</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Text Formatting</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs">**bold text**</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">*italic text*</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">~~strikethrough~~</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">`inline code`</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Lists</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs">
                                        - Bullet point
                                        <br />- Another item
                                    </div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">
                                        1. Numbered list
                                        <br />
                                        2. Second item
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Links & Images</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs">[Link text](https://example.com)</div>
                                    <div className="rounded bg-muted p-2 font-mono text-xs">![Image alt](image-url.jpg)</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Code Blocks</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs">
                                        ```js
                                        <br />
                                        const hello = &quot;world&quot;;
                                        <br />
                                        ```
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Tables</h4>
                                <div className="ml-4 space-y-1">
                                    <div className="rounded bg-muted p-2 font-mono text-xs">
                                        | Header 1 | Header 2 |<br />
                                        |----------|----------|
                                        <br />| Cell 1 | Cell 2 |
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
