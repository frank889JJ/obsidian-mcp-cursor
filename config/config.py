from pydantic import BaseSettings

class Settings(BaseSettings):
    # 服务器配置
    SERVER_NAME: str = "cursor-mcp-server"
    SERVER_VERSION: str = "1.0.0"
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    
    # 其他配置
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings() 