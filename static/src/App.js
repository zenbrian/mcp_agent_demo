import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Message from './components/Message';
import ToolCallsStatus from './components/ToolCallsStatus';

// API URL 配置
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  // 自動滾動到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 發送請求到API
  const sendQuery = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/run-agent`, {
        query: userMessage.content
      });
      
      const aiMessage = { 
        role: 'ai', 
        content: response.data.response,
        tool_calls: response.data.tool_calls
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending query:', error);
      const errorMessage = { 
        role: 'ai', 
        content: '抱歉，發生錯誤。請稍後再試。',
        error: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 清除對話記憶
  const clearMemory = async () => {
    try {
      await axios.delete(`${API_URL}/clear-memory`);
      setMessages([]);
      setShowMenu(false);
      alert('對話記憶已清除');
    } catch (error) {
      console.error('Error clearing memory:', error);
      alert('清除記憶失敗');
    }
  };

  // 獲取當前記憶
  const getMemory = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-memory`);
      setMessages(response.data.memory);
      setShowMenu(false);
    } catch (error) {
      console.error('Error fetching memory:', error);
      alert('獲取記憶失敗');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 頂部導航欄 */}
      <header className="header">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">MCP Agent 聊天界面</h1>
        </div>
      </header>

      {/* 聊天訊息容器 */}
      <div className="chat-container flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">🤖</div>
              <h2>歡迎使用 MCP Agent</h2>
              <p>開始輸入您的問題吧！</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index}>
                {/* 如果AI的回覆中有工具調用，顯示工具調用狀態列 */}
                {message.role === 'ai' && message.tool_calls && message.tool_calls.length > 0 && (
                  <ToolCallsStatus toolCalls={message.tool_calls} />
                )}
                <Message message={message} />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部輸入欄 */}
      <div className="input-container">
        <div className="container mx-auto max-w-4xl">
          <div className="input-box">
            {/* 漢堡菜單按鈕 */}
            <button 
              className="menu-button" 
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 輸入框 */}
            <input
              type="text"
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendQuery()}
              placeholder="輸入您的問題..."
              disabled={isLoading}
            />

            {/* 語音輸入按鈕 */}
            <button className="voice-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* 發送按鈕 */}
            <button
              onClick={sendQuery}
              disabled={isLoading}
              className="send-button"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* 漢堡菜單下拉內容 */}
          {showMenu && (
            <div className="menu-dropdown">
              <button 
                className="menu-item" 
                onClick={getMemory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                載入記憶
              </button>
              <button 
                className="menu-item" 
                onClick={clearMemory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                清除記憶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;