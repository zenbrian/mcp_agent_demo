from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("professorInfo")

class ToolRequest(BaseModel):
    name: str
    
class ToolResponse(BaseModel):
    results: str
    
@mcp.tool()
async def get_professor_info(request: ToolRequest) -> ToolResponse:
    """get_student_info"""
    result = f"{request.name}是一位品威嚴，但充滿智慧的教授。"
    return ToolResponse(results=result)


if __name__ == "__main__":
    mcp.run(transport="stdio")
    
    