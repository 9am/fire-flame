import React, { useState, useRef } from 'react';
import { FireFlame } from '@9am/fire-flame-react';

export default () => {
    const instance = useRef();
    const [ghost, toggleGhost] = useState(true);
    const color = ghost
        ? { innerColor: 'blue', outerColor: 'blueviolet' }
        : { innerColor: 'orange', outerColor: 'orangered' };
    const option = {
        x: 200,
        y: 200,
        mousemove: false,
        ...color,
    };
    return (
        <>
            <h2>React Component</h2>
            <button onClick={() => toggleGhost((val) => !val)}>toggle color</button>
            <button onClick={() => instance.current.start()}>start</button>
            <button onClick={() => instance.current.stop()}>stop</button>
            <button onClick={() => instance.current.set({ x: 300, y: 300 })}>set</button>
            <FireFlame option={option} ref={instance} />
        </>
    );
};
