import Color from 'color';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

export function Cursor(user: { id: string, name: string, color: string, position: [number, number], focus: boolean }) {

  const [localX, setLocalX] = useState<number>(user.position[0]);
  const [localY, setLocalY] = useState<number>(user.position[1]);

  useInterval(() => {
    setLocalX(lerp(localX, user.position[0], 0.4))
    setLocalY(lerp(localY, user.position[1], 0.4))
  }, 20)

  const color = Color(user.color).desaturate(user.focus ? 0 : 0.5).hex();
  const darkerColor = Color(user.color).darken(0.35).hex();
  return (
    <>
      <svg id={user.id} style={{ position: 'absolute', left: localX, top: localY }} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="32px" height="32px" fill-rule="nonzero">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style={{"mix-blend-mode": "normal"} as any}>
          <g transform="scale(5.33333,5.33333)">
            <path d="M27.8,39.7c-0.1,0 -0.2,0 -0.4,-0.1c-0.2,-0.1 -0.4,-0.3 -0.6,-0.5l-3.7,-8.6l-4.5,4.2c-0.1,0.2 -0.3,0.3 -0.6,0.3c-0.1,0 -0.3,0 -0.4,-0.1c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9v-22c0,-0.4 0.2,-0.8 0.6,-0.9c0.1,-0.1 0.3,-0.1 0.4,-0.1c0.2,0 0.5,0.1 0.7,0.3l16,15c0.3,0.3 0.4,0.7 0.3,1.1c-0.1,0.4 -0.5,0.6 -0.9,0.7l-6.3,0.6l3.9,8.5c0.1,0.2 0.1,0.5 0,0.8c-0.1,0.2 -0.3,0.5 -0.5,0.6l-2.9,1.3c-0.2,-0.2 -0.4,-0.2 -0.5,-0.2z" fill={color}></path>
            <path d="M18,12l16,15l-7.7,0.7l4.5,9.8l-2.9,1.3l-4.3,-9.9l-5.6,5.1v-22M18,10c-0.3,0 -0.5,0.1 -0.8,0.2c-0.7,0.3 -1.2,1 -1.2,1.8v22c0,0.8 0.5,1.5 1.2,1.8c0.3,0.2 0.6,0.2 0.8,0.2c0.5,0 1,-0.2 1.4,-0.5l3.4,-3.2l3.1,7.3c0.2,0.5 0.6,0.9 1.1,1.1c0.2,0.1 0.5,0.1 0.7,0.1c0.3,0 0.5,-0.1 0.8,-0.2l2.9,-1.3c0.5,-0.2 0.9,-0.6 1.1,-1.1c0.2,-0.5 0.2,-1.1 0,-1.5l-3.3,-7.2l4.9,-0.4c0.8,-0.1 1.5,-0.6 1.7,-1.3c0.3,-0.7 0.1,-1.6 -0.5,-2.1l-16,-15c-0.3,-0.5 -0.8,-0.7 -1.3,-0.7z" fill={darkerColor}></path>
          </g>
        </g>
      </svg>
      <p style={{ position: 'absolute', left: localX + 26, top: localY + 14, color: darkerColor }}>{user.name}</p>
    </>
  )
}