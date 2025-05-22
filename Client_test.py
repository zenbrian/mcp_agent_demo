from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import json
from dotenv import load_dotenv
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from FormatConverter import format_convert, AgentResponse


# 載入 .env
load_dotenv()

# === MCP CONFIG ===
def load_mcp_config(config_path="mcp_config.json"):
    try:
        with open(config_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"配置檔案 {config_path} 不存在")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="無效的JSON配置檔案")

def get_all_server_params():
    config = load_mcp_config()
    server_params = config.get("mcpServers", {})
    return server_params

# 全局變數
agent = None

async def init_agent():
    # 固定使用 gpt-4o-mini 模型
    model = ChatOpenAI(model="gpt-4o-mini")
    server_params = get_all_server_params()
    print(server_params)
    client = MultiServerMCPClient(server_params)
    all_tools = await client.get_tools()
    agent = create_react_agent(model, all_tools)
    response = await agent.ainvoke({
            "messages": [{"role": "user", "content": "你好!"}]
        })
    print(format_convert(response))
    return agent  # 添加這行來返回agent


# === 模型資料類 ===
class AgentRequest(BaseModel):
    query: str


# 起動時執行
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時執行
    print("Agent initializing...")
    global agent
    agent = await init_agent()
    print("Agent initialized!")
    yield
    # 關閉時執行
    print("Shutting down...")

# 建立應用
app = FastAPI(
    title="MCP Agent API", 
    description="MCP Agent",
    lifespan=lifespan
)
    
# REST API 端點
@app.post("/run-agent")
async def run_agent_endpoint(request: AgentRequest)-> AgentResponse:
    query = request.query
    raw_response = await agent.ainvoke({
            "messages": [{"role": "user", "content": query}]
        })
    # 直接返回格式化的響應
    return format_convert(raw_response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)