import { create } from "zustand";
import { io  } from 'socket.io-client';

interface Store {
  connected: boolean;
  screenFocused: boolean;
  user: {
    name: string;
    color: string;
  };
  mousePos: [number, number],
  roomId: string;
  roomConnected: boolean;
  otherUsers: {
    id: string;
    name: string;
    color: string;
    room_id: string;
    position: [number, number];
    focus: boolean;
  }[];
  updateUserName: (name: string) => void;
  updateUserColor: (color: string) => void;
  updateUser: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  updateFocus: (focus: boolean) => void;
}

const socket = io('https://xtpvjds2-8000.brs.devtunnels.ms/ws', { transports: ['websocket', 'polling', 'webtransport'] });

export const useStore = create<Store>((set, get) => ({
  connected: false,
  screenFocused: true,
  user:  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : { name: 'User', color: '#000000' },
  mousePos: [0, 0],
  roomId: '',
  roomConnected: false,
  otherUsers: [],
  updateUserName: (name: string) => {
    const { user } = get();
    set({ user: { ...user, name } });
  },
  updateUserColor: (color: string) => {
    const { user } = get();
    set({ user: { ...user, color } });
  },
  updateUser: () => {
    const { user } =  get()
    localStorage.setItem('user', JSON.stringify(user));
    socket.emit('update_user', { name: user.name, color: user.color });
  },
  joinRoom: (roomId: string) => {
    set({ roomId });
    socket.emit('join_room', roomId);
  },
  leaveRoom: () => {
    set({ roomConnected: false, roomId: '' });
    socket.emit('leave_room');
  },
  updateFocus: (focused: boolean) => {
    set({ screenFocused: focused })
    socket.emit('update_focus', focused);
  }
}));

socket.on("connect", () => {
  useStore.setState({ connected: socket.connected });
  const { updateUser } = useStore.getState();
  updateUser();
});

socket.on("disconnect", () => {
  useStore.setState({ connected: socket.connected, roomConnected: false, roomId: '', otherUsers: [] });
});

socket.on("user_data", (resp) => {
  // useStore.setState({ user: { name: resp.name, color: resp.color } });
});

socket.on("join_room", (resp: { room_id: string, users: Store['otherUsers'] }) => {
  console.log(resp);  
  useStore.setState({ roomConnected: true, roomId: resp.room_id, otherUsers: resp.users });
});

socket.on("leave_room", () => {
  useStore.setState({ roomConnected: false, roomId: '', otherUsers: [] });
});

socket.on("user_joined", (resp) => {
  const { otherUsers } = useStore.getState();
  const newOtherUsers = [...otherUsers, resp];
  useStore.setState({ otherUsers: newOtherUsers });
});

socket.on("user_left", (resp: string) => {
  const { otherUsers } = useStore.getState();
  const newOtherUsers = otherUsers.filter(user => user.id !== resp);
  useStore.setState({ otherUsers: newOtherUsers });
});

socket.on("user_updated", (resp) => {
  const { otherUsers } = useStore.getState();
  const newOtherUsers = otherUsers.filter(user => user.id !== resp.id);
  useStore.setState({ otherUsers: [...newOtherUsers, resp] });
});


onmousemove = (ev) => {
  useStore.setState({ mousePos: [ev.x, ev.y] });
}

setInterval(() => {
  const { mousePos, roomConnected } = useStore.getState();
  if (roomConnected) {
    socket.emit('update_position', { x: mousePos[0], y: mousePos[1] })
  }
}, 50);

window.addEventListener('focus', () => {
  console.log('focus')
  const { updateFocus } = useStore.getState();
  updateFocus(true);
});

window.addEventListener('blur', () => {
  const { updateFocus } = useStore.getState();
  updateFocus(false);
});