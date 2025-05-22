from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json

class ToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any]
    results: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    tool_calls: List[ToolCall] = []

def format_convert(raw_response: Any) -> AgentResponse:
    """
    將AI agent的原始回傳資料轉換為結構化的AgentResponse格式
    
    Args:
        raw_response: 原始的agent回傳資料
        
    Returns:
        AgentResponse: 結構化的回應資料
    """
    # 獲取消息列表
    if "messages" in raw_response:
        messages = raw_response["messages"]
    else:
        return AgentResponse(response="", tool_calls=[])
    
    # 初始化
    final_response = ""
    tool_calls_dict = {}
    
    # 處理所有消息
    for msg in messages:
        # 處理AI消息中的工具呼叫
        if msg.type == "ai" and hasattr(msg, "tool_calls") and msg.tool_calls:
            for tool_call in msg.tool_calls:
                tool_calls_dict[tool_call["id"]] = {
                    "name": tool_call["name"],
                    "arguments": tool_call["args"],
                    "results": None
                }
                
        # 處理工具回應
        elif msg.type == "tool" and hasattr(msg, "tool_call_id"):
            tool_id = msg.tool_call_id
            if tool_id in tool_calls_dict:
                try:
                    results = json.loads(msg.content)
                    tool_calls_dict[tool_id]["results"] = results
                except json.JSONDecodeError:
                    tool_calls_dict[tool_id]["results"] = {"raw": msg.content}
        
        # 獲取最終回應（最後一個有內容的AI消息）
        elif msg.type == "ai" and msg.content and (not hasattr(msg, "tool_calls") or not msg.tool_calls):
            final_response = msg.content
    
    # 構建工具呼叫列表
    tool_calls_list = [ToolCall(**data) for data in tool_calls_dict.values()]
    
    return AgentResponse(
        response=final_response,
        tool_calls=tool_calls_list
    )