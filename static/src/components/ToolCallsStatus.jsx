import React, { useState } from 'react';

const ToolCallsStatus = ({ toolCalls }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="tool-status">
      <div 
        className="tool-status-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          工具調用狀態
          <span className="ml-2 text-sm text-gray-500">
            ({toolCalls.length} 個工具被調用)
          </span>
        </h3>
        <button className="text-gray-500">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="tool-status-content">
          {toolCalls.map((tool, index) => (
            <div key={index} className="tool-item">
              <div className="tool-name">
                {tool.name}
                <span className="tool-badge">
                  工具 #{index + 1}
                </span>
              </div>
              
              <div className="mt-3 space-y-3">
                <div className="tool-section">
                  <h4>參數:</h4>
                  <pre>
                    {JSON.stringify(tool.arguments, null, 2)}
                  </pre>
                </div>
                
                <div className="tool-section">
                  <h4>結果:</h4>
                  <pre>
                    {JSON.stringify(tool.results, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolCallsStatus;