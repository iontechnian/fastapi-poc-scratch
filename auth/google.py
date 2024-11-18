from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from fastapi import APIRouter, Request
from config import config

def create_flow() -> Flow:
  flow = Flow.from_client_secrets_file(
    'google_oauth.json',
    scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/spreadsheets'],
  )
  flow.redirect_uri = f"{config.self_url}/auth/google/redirect"
  return flow

google_router = APIRouter(
  prefix="/google",
  tags=["google"],
)

@google_router.get('/login', response_class=RedirectResponse)
def google_login():
  flow = create_flow()
  auth_url, _ = flow.authorization_url(
    access_type='offline',
    include_granted_scopes='true',
  )
  return auth_url

@google_router.get('/redirect')
def google_redirect(request: Request):
  flow = create_flow()
  flow.fetch_token(authorization_response=str(request.url))
  return { 'access_token': flow.credentials.token, 'refresh_token': flow.credentials.refresh_token }
