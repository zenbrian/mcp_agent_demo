import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Message = ({ message }) => {
  const { role, content, error } = message;
  
  // 使用 ReactMarkdown 處理 markdown 格式的內容
  const renderContent = () => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div 
      className={`mb-4 ${role === 'user' ? 'text-right' : 'text-left'}`}
    >
      <div 
        className={`fade-in message-content ${
          role === 'user'
            ? 'user-message'
            : error
              ? 'bg-red-100 text-red-800 p-3 rounded-lg inline-block max-w-[80%]'
              : 'ai-message'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;