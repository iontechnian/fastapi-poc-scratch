from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Config(BaseSettings):
  self_url: str = 'http://localhost:8000'
  outlook_client_id: str
  outlook_client_secret: str

config = Config()


