import { exportToPDF } from '@/app/actions/pdf';

export async function downloadPDF(content: string, theme: string = 'light'): Promise<void> {
    const base64 = await exportToPDF(content, theme);

    const buffer = Buffer.from(base64, 'base64');

    const blob = new Blob([buffer], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'markdown-export.pdf';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
