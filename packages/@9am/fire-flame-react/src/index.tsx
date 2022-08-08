import React, { useRef, useEffect } from 'react';
import { FireFlame, Vector } from '@9am/fire-flame';
import type { FireFlameOption } from '@9am/fire-flame';

type FireFlameProps = {
    children?: React.ReactNode;
    option?: FireFlameOption;
}

const FireFlameComponent = ({ children, option = {} }: FireFlameProps) => {
    const container = useRef<HTMLDivElement>(null);
    const instance = useRef<FireFlame | null>(null);

    useEffect(() => {
        if (!instance.current) {
            instance.current = new FireFlame(container.current!, option);
        }
        return () => instance.current?.stop();
    }, []);

    useEffect(() => {
        instance.current?.setOption(option);
    }, [option]);

    return <div ref={container}>{children}</div>;
};

export { FireFlameComponent as FireFlame, FireFlameOption, Vector };
