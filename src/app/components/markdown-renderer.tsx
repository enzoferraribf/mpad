/* eslint-disable react/no-children-prop */

import { useTheme } from 'next-themes';

import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import RemarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css';

import { IMarkdownRenderer } from '@/app/models/markdown-renderer';

export function MarkdownRenderer({ content }: IMarkdownRenderer) {
    const { resolvedTheme } = useTheme();

    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[RemarkGfm, RemarkBreaks]}
            components={{
                code({ node, className, children, ...rest }) {
                    const match = /language-(\w+)/.exec(className || '');

                    if (match) {
                        return <SyntaxHighlighter PreTag="div" children={String(children).replace(/\n$/, '')} language={match[1]} style={resolvedTheme === 'dark' ? nord : oneLight} />;
                    }

                    return (
                        <code className={className} {...rest}>
                            {children}
                        </code>
                    );
                },
            }}
        />
    );
}
