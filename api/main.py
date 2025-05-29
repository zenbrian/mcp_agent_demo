from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import json
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from FormatConverter import format_convert, AgentResponse


# 載入 .env
load_dotenv()

# === MCP CONFIG ===
def load_mcp_config(config_path="mcp_config.json"):
    import os
    # 獲取當前腳本所在的目錄
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # 構建配置檔案的絕對路徑
    if not os.path.isabs(config_path):
        config_path = os.path.join(current_dir, config_path)
    
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
# 單一全局對話記憶
conversation_memory = []

async def init_agent():
    # 固定使用 gpt-4o-mini 模型
    model = ChatOpenAI(model="gpt-4o-mini")
    server_params = get_all_server_params()
    print(server_params)
    client = MultiServerMCPClient(server_params)
    all_tools = await client.get_tools()
    agent = create_react_agent(model, all_tools)
    system_prompt = "你是一位ai助手，只使用繁體中文回覆，根據使用者的需求調用對應的工具，注意如果是沒有相關的問題則不要調用工具。!"
    response = await agent.ainvoke({
            "messages": [{"role": "system", "content": system_prompt}]
        })
    print(format_convert(response))
    conversation_memory.append({"role": "system", "content": system_prompt})
    return agent


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
    description="MCP Agent with global conversation memory",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生產環境中，應該改為具體的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
# REST API 端點
@app.post("/run-agent")
async def run_agent_endpoint(request: AgentRequest) -> AgentResponse:
    global conversation_memory
    query = request.query
    
    # 建立完整的消息歷史，包含所有之前的對話
    messages = conversation_memory + [{"role": "user", "content": query}]
    
    # 調用agent
    raw_response = await agent.ainvoke({
        "messages": messages
    })
    
    response = format_convert(raw_response)
    # 更新對話記憶
    if response:
        # 添加用戶的問題和助手的回應到全局記憶中
        conversation_memory.append({"role": "user", "content": query})
        conversation_memory.append({"role":"ai", "content": response.response})
        
        # 限制記憶大小，避免過長
        MAX_MEMORY_MESSAGES = 50  # 可以根據需要調整
        if len(conversation_memory) > MAX_MEMORY_MESSAGES:
            conversation_memory = conversation_memory[-MAX_MEMORY_MESSAGES:]
    
    return response

# 只保留第一筆對話記憶
@app.delete("/clear-memory")
async def clear_memory():
    global conversation_memory
    if conversation_memory:
        conversation_memory = [conversation_memory[0]]
    return {"status": "success", "message": "Conversation memory cleared except first entry"}

# 獲取當前對話記憶
@app.get("/get-memory")
async def get_memory():
    global conversation_memory
    print(type(conversation_memory))
    return {"memory": conversation_memory}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)