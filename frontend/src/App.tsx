import './App.css';
import { UserSettings } from './user-settings';
import { Room } from './room';
import { useStore } from './store';
import { Cursor } from './cursor';

function App() {
  const connected = useStore(state => state.connected)
  const otherUsers = useStore(state => state.otherUsers)
  return (
    <>
      <div className='shadow-lg size-48 rounded-md m-2 bg-white p-2 h-64'>
        <p>{connected ? "Connected" : "Disconnected"}</p>
        <UserSettings />
        <Room />
      </div>
      {otherUsers.map(usr => <Cursor key={usr.id} id={usr.id} name={usr.name} color={usr.color} position={usr.position} focus={usr.focus} />)}
    </>
  );
}

export default App;
