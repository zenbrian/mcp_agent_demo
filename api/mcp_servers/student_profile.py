from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("StudentInfo")

class ToolRequest(BaseModel):
    name: str
    
class ToolResponse(BaseModel):
    results: str

@mcp.tool()
async def get_student_info(request: ToolRequest) -> ToolResponse:
    """get_student_info"""
    result = f"{request.name}是一位品學兼優的學生，學號是12345678，成績是95分。"
    return ToolResponse(results=result)


if __name__ == "__main__":
    mcp.run(transport="stdio")
    
    