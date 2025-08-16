import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { generatePDFTemplate } from '@/app/lib/pdf-template';

export async function downloadPDF(content: string, theme: string = 'light'): Promise<void> {
    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
        }),
    );

    const renderedContent = await marked.parse(content, {
        gfm: true,
        breaks: true,
    });

    const htmlContent = generatePDFTemplate(renderedContent, theme);

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        throw new Error('Unable to open print window');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 100);
    };
}
