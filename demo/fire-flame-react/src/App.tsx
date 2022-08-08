import React, { useState } from 'react';
import { FireFlame, FireFlameOption, Vector } from '@9am/fire-flame-react';

export default () => {
    const [windX, setWindX] = useState(0);
    const option = {
        x: 200,
        y: 200,
        wind: new Vector({ x: windX, y: -0.6 }),
    };
    const onUpdate = () => {
        setWindX((val) => val > 1 ? -1 : val + 0.1);
    };
    return (
        <>
            <h2>React Component</h2>
            <button onClick={onUpdate}>
                update wind
            </button>
            <FireFlame option={option} />
        </>
    );
}
