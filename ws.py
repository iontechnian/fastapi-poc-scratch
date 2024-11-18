from socketio import AsyncServer, ASGIApp
from pydantic import BaseModel, Field
from typing import Any, Tuple, List

sio = AsyncServer(async_mode='asgi', cors_allowed_origins="*")

sio.instrument(auth={
  'username': 'elly',
  'password': 'peck',
});

class UserSession(Any):
  name: str
  color: str
  room_id: str | None

class User(UserSession):
  id: str
  position: Tuple[float, float]
  focus: bool

rooms: dict[str, List[User]] = {}

def get_user_in_room(room_id: str, user_id: str) -> User | None:
  if room_id not in rooms:
    return None
  return next((item for item in rooms[room_id] if item.id == user_id), None)

def remove_user_from_room(room_id: str, user_id: str):
  if room_id not in rooms:
    return
  rooms[room_id] = list(item for item in rooms[room_id] if item.id != user_id)


@sio.event
async def connect(sid: str, environ):
    user = UserSession()
    user.name = "User"
    user.color = "#888888"
    user.room_id = None
    await sio.save_session(sid, user)
    await sio.emit('user_data', vars(user), sid)

@sio.event
async def disconnect(sid: str):
    await leave_room(sid)

class UpdateUser(BaseModel):
  name: str = Field(min_length=2, max_length=32)
  color: str = Field(pattern=r'^#[0-9a-f]{6}$')

@sio.event
async def update_user(sid: str, msg):
  data = UpdateUser.model_validate(msg)
  user: UserSession = await sio.get_session(sid)
  user.name = data.name
  user.color = data.color
  await sio.save_session(sid, user)
  if user.room_id != None:
    room_user = get_user_in_room(user.room_id, sid)
    room_user.name = data.name
    room_user.color = data.color
    await sio.emit('user_updated', vars(room_user), room=user.room_id, skip_sid=sid)

@sio.event
async def join_room(sid: str, room_id: str):
  user: UserSession = await sio.get_session(sid)
  await leave_room(sid)
  await sio.enter_room(sid, room_id)
  user.room_id = room_id
  await sio.save_session(sid, user)
  if room_id not in rooms:
    rooms[room_id] = []

  room_user = User()
  room_user.id = sid
  room_user.name = user.name
  room_user.color = user.color
  room_user.position = [0, 0]
  room_user.focus = True

  rooms[room_id].append(room_user)

  payload = {
    'room_id': room_id,
    'users': list(vars(usr) for usr in rooms[room_id] if usr.id != sid)
  }

  await sio.emit(
    'join_room',
    payload,
    to=sid,
  )

  await sio.emit(
    'user_joined',
    vars(room_user),
    room=room_id,
    skip_sid=sid,
  )

@sio.event
async def leave_room(sid: str):
  user: UserSession = await sio.get_session(sid)
  if user.room_id == None:
    return
  
  remove_user_from_room(user.room_id, sid)
  await sio.leave_room(sid, user.room_id)
  
  await sio.emit('leave_room', to=sid)
  await sio.emit('user_left', sid, skip_sid=sid, room=user.room_id)

  user.room_id = None
  await sio.save_session(sid, user)

class UpdatePositon(BaseModel):
  x: float
  y: float

@sio.event
async def update_position(sid: str, msg):
  data = UpdatePositon.model_validate(msg)
  user: UserSession = await sio.get_session(sid)
  if user.room_id == None:
    return
  room_user = get_user_in_room(user.room_id, sid)
  if room_user == None:
    return
  room_user.position = (data.x, data.y)

  await sio.emit('user_updated', vars(room_user), room=user.room_id, skip_sid=sid)

@sio.event
async def update_focus(sid: str, msg: bool):
  user: UserSession = await sio.get_session(sid)
  if user.room_id == None:
    return
  room_user = get_user_in_room(user.room_id, sid)
  if room_user == None:
    return
  room_user.focus = msg

  await sio.emit('user_updated', vars(room_user), room=user.room_id, skip_sid=sid)