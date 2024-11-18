import { useState } from "react";
import { useStore } from "./store";
import { useShallow } from 'zustand/react/shallow'

export function Room() {
  const [roomId, roomConnected] = useStore(useShallow(state => [state.roomId, state.roomConnected]));
  const [joinRoom, leaveRoom] = useStore(useShallow(state => [state.joinRoom, state.leaveRoom]));
  const connected = useStore(state => state.connected);

  const [roomInput, setRoomInput] = useState<string>('');

  return (<>
    <p>Room:</p>
    <input
      type="text"
      name="roomInput"
      id="roomInput"
      className='outline-slate-50 border-slate-50 bg-slate-50'
      value={roomInput}
      onInput={(e) => setRoomInput(e.currentTarget.value)}
    />
    <button
      disabled={roomInput === '' || !connected }
      onClick={() => joinRoom(roomInput)}
    >Join</button>
    {roomId && <>
      <p>{ roomConnected ? `Joined ${roomId}` : `Joining ${roomId}...` }</p>
      <button onClick={() => leaveRoom()} >Leave</button>
    </>}
  </>)
}