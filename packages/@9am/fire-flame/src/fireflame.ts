import Vector from './vector';
import Particle from './particle';
import { Painter, CanvasPainter, SVGPainter } from './painter';
import { PI_2, PI_H, requestAnimation } from './util';

const tv = new Vector({ x: 0, y: 0 });

export type PainterType = 'canvas' | 'svg';
export type SizeCurveFunction = (x: number, prev: number) => number;

export interface FireFlameOption {
    x?: number;
    y?: number;
    mousemove?: boolean;
    w?: number;
    h?: number;
    fps?: number;
    wind?: Vector;
    friction?: number;
    particleNum?: number;
    particleDistance?: number;
    particleFPS?: number;
    sizeCurveFn?: SizeCurveFunction;
    innerColor?: string;
    outerColor?: string;
    painterType?: PainterType;
}

class FireFlame extends Vector {
    protected painter: Painter;
    protected pIndex = 1;
    protected particles: Map<number, Particle> = new Map();
    protected spawnAnimation: any;
    protected renderAnimation: any;

    protected static painterMap = {
        canvas: CanvasPainter,
        svg: SVGPainter,
    };

    static getDefaultOption(): FireFlameOption {
        return {
            x: 0,
            y: 0,
            mousemove: true,
            w: 400,
            h: 400,
            fps: 60,
            wind: new Vector({ x: 0, y: -0.8 }),
            friction: 0.98,
            particleNum: 15,
            particleDistance: 10,
            particleFPS: 10,
            sizeCurveFn: (x: number, prev: number): number =>
                x > 0.7 ? Math.sqrt(1 - x) * 50 : Math.pow(x - 1, 2) * -30 + 30,
            innerColor: 'blue',
            outerColor: 'blueviolet',
            painterType: 'svg',
        };
    }

    constructor(readonly container: HTMLElement, protected option: FireFlameOption = {}) {
        super({ x: option.x || 0, y: option.y || 0 });
        const finalOption = { ...FireFlame.getDefaultOption(), ...option };
        this.preparePainter(finalOption.painterType!);
        this.setOption(finalOption);
    }

    protected preparePainter(pType: PainterType) {
        this.painter = new FireFlame.painterMap[pType]();
        this.container?.appendChild(this.painter.dom);
    }

    start() {
        this.spawnAnimation?.start();
        this.renderAnimation?.start();
    }

    stop() {
        this.spawnAnimation?.stop();
        this.renderAnimation?.stop();
    }

    setOption(option: FireFlameOption) {
        const { mousemove, fps, w, h, particleFPS, particleNum } = this.option;
        this.option = { ...this.option, ...option };
        if (this.option.w !== w || this.option.h !== h) {
            this.painter.updateSize({ w: this.option.w!, h: this.option.h! });
        }
        if (this.option.particleNum !== particleNum) {
            this.particles.clear();
            this.pIndex = 1;
        }
        if (this.option.mousemove !== mousemove) {
            this.container.addEventListener;
            const fn = this.option.mousemove
                ? this.container?.addEventListener
                : this.container?.removeEventListener;
            fn?.call(this.container!, 'mousemove', <EventListener>this.onMove, true);
        }
        if (this.option.particleFPS !== particleFPS) {
            this.spawnAnimation?.stop();
            this.spawnAnimation = requestAnimation(this.spawn, this.option.particleFPS!);
        }
        if (this.option.fps !== fps) {
            this.renderAnimation?.stop();
            this.renderAnimation = requestAnimation(this.render, this.option.fps!);
        }
    }

    protected spawn = () => {
        const { particleNum } = this.option;
        const p = new Particle({
            x: this.x,
            y: this.y,
            v: new Vector({ m: Math.random() * 2, d: Math.random() * PI_2 }),
        });
        this.particles.set(this.pIndex, p);
        if (this.pIndex > particleNum!) {
            this.particles.delete(this.pIndex - particleNum!);
        }
        this.pIndex++;
    };

    protected updateParticles() {
        const { wind, friction, sizeCurveFn, particleNum, particleDistance } =
            this.option;
        let count = 0;
        for (const [i, p] of this.particles) {
            const np = this.particles.get(i + 1) ?? p;
            // random wind
            tv.set({ m: 0.1, d: PI_2 * Math.random() });
            p.v.add(Vector.add(wind!, tv)).multiply(friction!);
            p.size = sizeCurveFn!(count++ / (particleNum! - 1), p.size);
            p.update();
            p.link = Vector.subtract(p, np);
            if (p.link.m > particleDistance!) {
                const cx = p.x;
                const cy = p.y;
                p.link.m = particleDistance!;
                p.set({ x: np.x + p.link.x, y: np.y + p.link.y });
                p.v.add(tv.set({ x: p.x - cx, y: p.y - cy }).multiply(0.05));
            }
        }
    }

    protected getPath(): Array<[Vector, Vector]> {
        // update path
        const ascQ: Array<[Vector, Vector]> = [];
        const descQ: Array<[Vector, Vector]> = [];
        const path = new Path2D();
        for (const [i, p] of this.particles) {
            const np = this.particles.get(i + 1) ?? p;
            const pp = this.particles.get(i - 1) ?? p;
            if (np === p && pp === p) {
                path.moveTo(p.x, p.y);
                continue;
            }
            const pAngle = p.link.d + PI_H;
            const npAngle = np.link.d + PI_H;
            const ppAngle = pp.link.d + PI_H;
            const b = Vector.subtract(pp, tv.set({ m: pp.size, d: ppAngle }));
            const c = Vector.add(p, tv.set({ m: p.size, d: pAngle }));
            const d = Vector.subtract(p, tv);
            const e = Vector.add(np, tv.set({ m: np.size, d: npAngle }));
            const ec = Vector.add(e, c).multiply(0.5);
            const bd = Vector.add(b, d).multiply(0.5);
            ascQ.push([c, ec]);
            descQ.unshift([d, bd]);
        }
        return [...ascQ, ...descQ];
    }

    protected render = () => {
        this.updateParticles();
        const path = this.getPath();
        const option = { ...this.option, x: this.x, y: this.y };
        this.painter.draw(path, option);
    };

    protected onMove = (evt: MouseEvent) => {
        this.set({ x: evt.offsetX, y: evt.offsetY });
    };

    destroy() {
        this.stop();
        this.particles.clear();
    }
}

export default FireFlame;
