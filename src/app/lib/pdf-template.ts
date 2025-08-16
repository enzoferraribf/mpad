export function generatePDFTemplate(content: string, theme: string): string {
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
                    body {
                        background: ${themeColors.printBackground} !important;
                    }
                    .markdown-body {
                        background: ${themeColors.printBackground} !important;
                        color: ${themeColors.printText} !important;
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
