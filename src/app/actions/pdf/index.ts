'use server';

import puppeteer from 'puppeteer';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { generatePDFTemplate } from '@/app/lib/pdf-template';

export async function exportToPDF(content: string, theme: string = 'light'): Promise<string> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();

        marked.use(
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                },
            }),
        );

        const renderedContent = await marked(content, {
            gfm: true,
            breaks: true,
        });

        const htmlContent = generatePDFTemplate(renderedContent, theme);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm',
            },
            printBackground: true,
        });

        return Buffer.from(pdf).toString('base64');
    } finally {
        await browser.close();
    }
}
