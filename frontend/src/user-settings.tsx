import { useStore } from "./store";
import { useShallow } from "zustand/react/shallow";

export function UserSettings() {
  const { name, color } = useStore(state => state.user);
  const [updateUserName, updateUserColor] = useStore(useShallow((state) => [state.updateUserName, state.updateUserColor]));
  const updateUser = useStore((state) => state.updateUser);


  return (<>
    <p>User:</p>
    <input
      type="text"
      name="userName"
      id="userName"
      className='outline-slate-50 border-slate-50 bg-slate-50'
      value={name}
      onInput={(e) => updateUserName(e.currentTarget.value)}
      onBlur={() => updateUser()}
    />
    <input 
      type="color"
      name="usercolor"
      id="userColor"
      value={color}
      onInput={(e) => updateUserColor(e.currentTarget.value)}
      onBlur={() => updateUser()}
    />
  </>)
}