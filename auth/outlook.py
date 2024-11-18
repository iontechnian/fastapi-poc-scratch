from fastapi.responses import RedirectResponse
from fastapi import APIRouter
from config import config
from msal import ConfidentialClientApplication
from urllib.parse import quote_plus, urlencode
from requests import post

redirect_url = f"{config.self_url}/auth/outlook/redirect"
scopes = "offline_access user.read calendars.readwrite"

outlook_router = APIRouter(
  prefix="/outlook",
  tags=["outlook"],
)

@outlook_router.get('/login', response_class=RedirectResponse)
def outlook_login():
  query = urlencode([
    ("client_id", config.outlook_client_id),
    ("response_type", "code"),
    ("redirect_uri", redirect_url),
    ("response_mode", "query"),
    ("scope", scopes),
  ])
  return f"https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?{query}"

@outlook_router.get('/redirect')
def outlook_redirect(code: str | None = None, error_description: str | None = None):
  if error_description:
    print(error_description)
    return
  query = urlencode([
    ("client_id", config.outlook_client_id),
    ("scope", scopes),
    ("code", code),
    ("redirect_uri", redirect_url),
    ("grant_type", "authorization_code"),
    ("client_secret", config.outlook_client_secret),
  ])
  resp = post("https://login.microsoftonline.com/consumers/oauth2/v2.0/token", query)
  return { 'access_token': resp.json()['access_token'], 'refresh_token': resp.json()['refresh_token'] }