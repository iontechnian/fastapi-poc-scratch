from fastapi import APIRouter
from .google import google_router
from .outlook import outlook_router

auth_router = APIRouter(
  prefix="/auth"
)

auth_router.include_router(google_router)
auth_router.include_router(outlook_router)
