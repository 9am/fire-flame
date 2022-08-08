import Vector from './vector';
import Particle from './particle';
import { PI_2, PI_H, requestAnimation } from './util';

const tv = new Vector({ x: 0, y: 0 });

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
    particleShow?: boolean;
    particleNum?: number;
    particleDistance?: number;
    particleFPS?: number;
    sizeCurveFn?: SizeCurveFunction;
    innerColor?: string;
    outerColor?: string;
}

class FireFlame extends Vector {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected pIndex = 0;
    protected particles: Map<number, Particle>;
    protected spawnAnimation: any;
    protected renderAnimation: any;

    static getDefaultOption(): FireFlameOption {
        return {
            x: 0,
            y: 0,
            mousemove: true,
            w: 400,
            h: 400,
            fps: 60,
            particleShow: false,
            wind: new Vector({ x: 0, y: -0.8 }),
            friction: 0.98,
            particleNum: 15,
            particleDistance: 10,
            particleFPS: 10,
            sizeCurveFn: (x: number, prev: number): number =>
                x > 0.7 ? Math.sqrt(1 - x) * 50 : Math.pow(x - 1, 2) * -30 + 30,
            innerColor: 'blue',
            outerColor: 'blueviolet',
        };
    }

    constructor(readonly container: HTMLElement, protected option: FireFlameOption = {}) {
        super({ x: option.x || 0, y: option.y || 0 });
        this.particles = new Map();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.container?.appendChild(this.canvas);
        this.setOption({ ...FireFlame.getDefaultOption(), ...option });
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
        if (this.option.w !== w) {
            this.canvas.setAttribute('width', this.option.w + '');
        }
        if (this.option.h !== h) {
            this.canvas.setAttribute('height', this.option.h + '');
        }
        if (this.option.particleNum !== particleNum) {
            this.particles.clear();
            this.pIndex = 0;
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
            this.particles.delete(this.pIndex - particleNum! - 1);
        }
        this.pIndex++;
    };

    protected update(): Path2D {
        const {
            wind,
            friction,
            sizeCurveFn,
            particleNum,
            particleDistance,
            particleShow,
        } = this.option;
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
        // update path
        const ascQ: Array<[Vector, Vector]> = [];
        const descQ: Array<[Vector, Vector]> = [];
        const path = new Path2D();
        for (const [i, p] of this.particles) {
            if (particleShow!) {
                p.render(this.ctx);
                continue;
            }
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
        [...ascQ, ...descQ].forEach(([p1, p2]) => {
            path.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        });
        path.closePath();
        return path;
    }

    protected render = () => {
        const { particleNum, particleDistance, innerColor, outerColor } = this.option;
        // clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // update particles
        const path = this.update();
        // draw
        const gradient = this.ctx.createRadialGradient(
            this.x,
            this.y,
            Math.random() * 5,
            this.x,
            this.y,
            particleNum! * particleDistance! * 0.5
        );
        gradient.addColorStop(0, innerColor!);
        gradient.addColorStop(1, outerColor!);
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = gradient;
        this.ctx.fill(path);
        this.ctx.filter = 'blur(4px)';
        this.ctx.lineWidth = 4;
        this.ctx.stroke(path);
        this.ctx.restore();
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
