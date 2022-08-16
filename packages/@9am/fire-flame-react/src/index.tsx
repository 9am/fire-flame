import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { FireFlame, Vector } from '@9am/fire-flame';
import type { FireFlameOption } from '@9am/fire-flame';

type FireFlameProps = {
    children?: React.ReactNode;
    option?: FireFlameOption;
}

const FireFlameComponent = React.forwardRef(({ children, option = {} }: FireFlameProps, ref) => {
    const container = useRef<HTMLDivElement>(null);
    const instance = useRef<FireFlame | null>(null);

    useImperativeHandle(ref, () => ({
        setOption: (option: FireFlameOption) => {
            instance.current?.setOption(option);
        },
        start: () => {
            instance.current?.start();
        },
        stop: () => {
            instance.current?.stop();
        },
        set: (val: any) => {
            instance.current?.set(val);
        }
    }));

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
});

export { FireFlameComponent as FireFlame, FireFlameOption, Vector };
