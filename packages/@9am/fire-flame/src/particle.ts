import Vector from './vector';
import { PI_2, PI_H } from './util';

const tv = new Vector({ x: 0, y: 0 });

class Particle extends Vector {
    v: Vector;
    link: Vector;
    size: number;

    constructor({ x = 0, y = 0, v = new Vector({ x: 0, y: 0 }), size = 1 }) {
        super({ x, y });
        this.v = v;
        this.size = size;
        this.link = new Vector({ x: 0, y: 0 });
    }

    update(): void {
        this.add(this.v);
    }

    render(ctx: CanvasRenderingContext2D) {
        tv.set({ m: this.size, d: this.v.d + PI_H });
        const a = Vector.add(this, tv);
        const b = Vector.subtract(this, tv);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, PI_2);
        ctx.closePath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.fill();
    }
}

export default Particle;
