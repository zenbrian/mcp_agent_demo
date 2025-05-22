from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("Calculator")

class ToolRequest(BaseModel):
    num1: int
    num2: int
    
class ToolResponse(BaseModel):
    results: int
    
@mcp.tool()
async def Calculator(request: ToolRequest) -> ToolResponse:
    """get_student_info"""
    num1 = request.num1
    num2 = request.num2
    result = num1 + num2
    return ToolResponse(results=result)


if __name__ == "__main__":
    mcp.run(transport="stdio")
    
    