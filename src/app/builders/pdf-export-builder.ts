import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

export class PDFExportBuilder {
    private content: string | null = null;
    private theme: string | null = null;
    private markedOptions: any | null = null;
    private highlightConfig: any | null = null;
    private templateGenerator: ((content: string, theme: string) => string) | null = null;
    private printDelay: number | null = null;
    private windowTarget: string | null = null;
    private autoClose: boolean | null = null;

    static create() {
        return new PDFExportBuilder();
    }

    withContent(content: string) {
        this.content = content;
        return this;
    }

    withTheme(theme: string) {
        this.theme = theme;
        return this;
    }

    withMarkedOptions(options: any) {
        this.markedOptions = options;
        return this;
    }

    withHighlightConfig(config: any) {
        this.highlightConfig = config;
        return this;
    }

    withCustomTemplate(generator: (content: string, theme: string) => string) {
        this.templateGenerator = generator;
        return this;
    }

    withPrintDelay(delay: number) {
        this.printDelay = delay;
        return this;
    }

    withWindowTarget(target: string) {
        this.windowTarget = target;
        return this;
    }

    withAutoClose(autoClose: boolean) {
        this.autoClose = autoClose;
        return this;
    }

    async export(): Promise<void> {
        if (!this.content) {
            throw new Error('Content is required for PDF export');
        }

        if (!this.windowTarget) {
            throw new Error('Window target is required for PDF export');
        }

        const theme = this.theme ?? 'light';
        const markedOptions = this.markedOptions ?? { gfm: true, breaks: true };
        const printDelay = this.printDelay ?? 100;
        const autoClose = this.autoClose ?? true;

        const marked = this.highlightConfig ? new Marked(markedHighlight(this.highlightConfig)) : new Marked();

        const renderedContent = await marked.parse(this.content, markedOptions);

        const htmlContent = this.templateGenerator
            ? this.templateGenerator(renderedContent, theme)
            : this.generatePDFTemplate(renderedContent, theme);

        const printWindow = window.open('', this.windowTarget);

        if (!printWindow) {
            throw new Error('Unable to open print window');
        }

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();

                if (autoClose) {
                    printWindow.close();
                }
            }, printDelay);
        };
    }

    private generatePDFTemplate(content: string, theme: string): string {
        const colors = {
            dark: {
                background: '#0d1117',
                text: '#f0f6fc',
                codeBackground: '#161b22',
                printBackground: '#0d1117',
                printText: '#f0f6fc',
                highlightTheme: 'github-dark',
            },
            light: {
                background: '#ffffff',
                text: '#24292f',
                codeBackground: '#f6f8fa',
                printBackground: 'white',
                printText: 'black',
                highlightTheme: 'github',
            },
        };

        const themeColors = colors[theme as keyof typeof colors] || colors.light;

        return `
        <!DOCTYPE html>
        <html lang="en" data-theme="${theme}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Export</title>
            <link rel="stylesheet" href="https://unpkg.com/github-markdown-css@5.8.1/github-markdown.css">
            <link rel="stylesheet" href="https://unpkg.com/highlight.js@11.8.0/styles/${themeColors.highlightTheme}.css">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                    padding: 0;
                    margin: 0;
                    background: ${themeColors.background};
                    color: ${themeColors.text};
                }
                .markdown-body {
                    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
                    letter-spacing: -0.025em;
                    box-sizing: border-box;
                    min-width: 200px;
                    max-width: 980px;
                    padding: 20px;
                    margin: 0 auto;
                    background: ${themeColors.background};
                    color: ${themeColors.text};
                }
                pre, code {
                    background-color: ${themeColors.codeBackground} !important;
                }
                .hljs {
                    background: ${themeColors.codeBackground} !important;
                }
                img {
                    display: block;
                    margin: 0 auto;
                    max-width: 100%;
                    height: auto;
                }
                @media print {
                    @page {
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        background: ${themeColors.printBackground} !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .markdown-body {
                        background: ${themeColors.printBackground} !important;
                        color: ${themeColors.printText} !important;
                        margin: 0 !important;
                        padding: 20px !important;
                        max-width: none !important;
                    }
                    pre, code {
                        background-color: ${themeColors.codeBackground} !important;
                    }
                    .hljs {
                        background: ${themeColors.codeBackground} !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="markdown-body">
                ${content}
            </div>
        </body>
        </html>
    `;
    }
}
