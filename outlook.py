from fastapi import APIRouter, Depends
from requests import get, post
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated

ms_graph_url = "https://graph.microsoft.com/v1.0"

outlook_router = APIRouter(
  prefix="/outlook",
  tags=["outlook"],
)

security = HTTPBearer()
Credentials = Annotated[HTTPAuthorizationCredentials, Depends(security)]

@outlook_router.get('calendars')
def list_calendars(credentials: Credentials):
  resp = get(f"{ms_graph_url}/me/calendars", headers={ 'authorization': f"Bearer {credentials.credentials}" })
  return resp.json()

@outlook_router.get('calendar/{calendar_id}/events')
def get_calendar_events(calendar_id: str, credentials: Credentials):
  resp = get(f"{ms_graph_url}/me/calendars/{calendar_id}/events", headers={ 'authorization': f"Bearer {credentials.credentials}" })
  return resp.json()