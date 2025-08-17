import { useTheme } from 'next-themes';

import { useUIStore } from '@/app/stores/ui-store';
import { useDocumentStore } from '@/app/stores/document-store';
import { useFileStore } from '@/app/stores/file-store';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/app/components/shadcn/command';

import { handleFileUpload } from '@/app/lib/file';
import { downloadPDF } from '@/app/lib/pdf-export';

export function CommandBar() {
    const { setTheme, resolvedTheme } = useTheme();

    const { command, setCommand, setExplorer, setStorage, setLayout } = useUIStore();

    const { getTextContent } = useDocumentStore();

    const { fileDocument } = useFileStore();

    const content = getTextContent();

    const handleFiles = () => {
        setExplorer(true);
        setCommand(false);
    };

    const handleStorage = () => {
        setStorage(true);
        setCommand(false);
    };

    const handleUploadCommand = () => {
        handleFileUpload(fileDocument);
        setCommand(false);
    };

    const handlePDFExport = async () => {
        await downloadPDF(content, resolvedTheme || 'light');
    };

    const handleLayoutChange = (layout: 'editor' | 'preview' | 'default') => {
        setLayout(layout);
        setCommand(false);
    };

    const handleTheme = (theme: 'light' | 'dark') => {
        setTheme(theme);
        setCommand(false);
    };

    return (
        <CommandDialog open={command} onOpenChange={setCommand}>
            <CommandInput placeholder="Type a command or search..." />

            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Files">
                    <CommandItem onSelect={() => handleFiles()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📁 Explorer</h3>
                            <span className="command-description">{"View this pad's file structure."}</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleUploadCommand()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📤 Upload File</h3>
                            <span className="command-description">Upload files to this pad (max 1MB, 5 files)</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleStorage()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">🗄️ Storage</h3>
                            <span className="command-description">View uploaded files in this pad</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handlePDFExport()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📄 Export to PDF</h3>
                            <span className="command-description">
                                Export rendered markdown to PDF with current styles
                            </span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Layout">
                    <CommandItem onSelect={() => handleLayoutChange('editor')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">✏️ Editor</h3>
                            <span className="command-description">Changes the Mpad view to edit-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayoutChange('preview')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📄 Preview</h3>
                            <span className="command-description">Changes the Mpad view to preview-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayoutChange('default')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">✏️📄 Editor+Preview</h3>
                            <span className="command-description">Changes the Mpad view to default.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Themes">
                    <CommandItem onSelect={() => handleTheme('dark')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">🌙 Dark</h3>
                            <span className="command-description">Changes Mpad to dark mode.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleTheme('light')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">☀️ Light</h3>
                            <span className="command-description">Changes Mpad to light mode.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
