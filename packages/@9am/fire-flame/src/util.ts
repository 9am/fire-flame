export const PI_2 = Math.PI * 2;
export const PI_H = Math.PI * 0.5;

export const requestAnimation = (fn: Function, fps: number) => {
    let tsPrev = 0;
    let interval = 1000 / fps;
    let id = 0;

    const frame = (ts: number) => {
        if (ts - tsPrev < interval) {
            id = requestAnimationFrame(frame);
            return;
        }
        tsPrev = ts;
        fn();
        id = requestAnimationFrame(frame);
    };

    const isRunning = () => id !== 0;

    const setFPS = (val: number) => {
        interval = 1000 / val;
    };

    const stop = () => {
        cancelAnimationFrame(id);
        id = 0;
    };

    const start = () => {
        if (isRunning()) {
            return;
        }
        tsPrev = 0;
        id = requestAnimationFrame(frame);
    };

    start();

    return {
        start,
        stop,
        setFPS,
        isRunning,
    };
};
