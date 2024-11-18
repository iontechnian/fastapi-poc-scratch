from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import auth_router
import uvicorn
from outlook import outlook_router
from sheet import sheet_router
from ws import sio
from socketio import ASGIApp

app = FastAPI()

origins = [
    "*",
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(auth_router)
app.include_router(outlook_router)
app.include_router(sheet_router)
app.mount('/', ASGIApp(sio))

@app.get("/")
async def root():
    return {"message": "Hello World"}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)