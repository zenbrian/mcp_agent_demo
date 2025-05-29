# MCP Agent Demo

一個基於 Model Context Protocol (MCP) 的 AI 聊天機器人演示專案。

## 功能介紹

### 🤖 智能對話
- 使用 OpenAI GPT-4o-mini 進行對話
- 支援繁體中文互動
- 具備對話記憶功能

### 🔧 工具調用
Agent 可以調用以下工具(模擬)：
- **學生資料查詢** - 輸入學生姓名，查詢學號和成績
- **教授資料查詢** - 輸入教授姓名，查詢基本資訊
你可以根據你的需求新增更多的mcp工具

### 💻 Web 界面
- 現代化聊天介面
- 即時顯示工具調用狀態
- 支援 Markdown 格式顯示
- 對話記憶管理（載入/清除）



## Quick Start
```bash
# 複製環境設定檔
cp .env_example .env
# 填入你的 OpenAI API Key
# 設定LANGSMITH進行追蹤(可選)

# 複製 MCP 設定檔
cp api/mcp_config_example.json api/mcp_config.json

# 啟動服務
docker-compose up -d
```

### 訪問應用
- 聊天界面：http://localhost:10002
- API 服務：http://localhost:10001


## 技術架構

- **後端**：Python FastAPI + LangChain + MCP
- **前端**：React + Tailwind CSS