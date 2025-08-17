import hljs from 'highlight.js';

import { PDFExportBuilder } from '@/app/builders/pdf-export-builder';

export async function downloadPDF(content: string, theme: string = 'light'): Promise<void> {
    await PDFExportBuilder.create()
        .withContent(content)
        .withTheme(theme)
        .withHighlightConfig({
            langPrefix: 'hljs language-',
            highlight: (code: string, lang: string) => {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
        })
        .withWindowTarget('_blank')
        .export();
}
