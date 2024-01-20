/* eslint-disable react/no-children-prop */

import RemarkGfm from "remark-gfm";

import RemarkBreaks from "remark-breaks";

import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

import "github-markdown-css";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[RemarkGfm, RemarkBreaks]}
      components={{
        code({ node, className, children, ...rest }) {
          const match = /language-(\w+)/.exec(className || "");

          if (match) {
            return (
              <SyntaxHighlighter
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={darcula}
              />
            );
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
