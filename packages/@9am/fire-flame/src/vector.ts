export interface Point {
    x: number;
    y: number;
}

export interface MagDir {
    m: number;
    d: number;
}

export type VectorProps = Point | MagDir;

class Vector {
    x: number = 0;
    y: number = 0;

    static add(a: Vector, b: Vector): Vector {
        return new Vector({
            x: a.x + b.x,
            y: a.y + b.y,
        });
    }

    static subtract(a: Vector, b: Vector): Vector {
        return new Vector({
            x: a.x - b.x,
            y: a.y - b.y,
        });
    }

    constructor(params: VectorProps) {
        this.set(params);
    }

    set(val: VectorProps): Vector {
        if ('d' in val) {
            const { d, m } = val;
            this.x = Math.cos(d) * m;
            this.y = Math.sin(d) * m;
        } else {
            this.x = val.x;
            this.y = val.y;
        }
        return this;
    }

    add(v: Vector): Vector {
        return this.set({
            x: this.x + v.x,
            y: this.y + v.y,
        });
    }

    subtract(v: Vector): Vector {
        return this.set({
            x: this.x - v.x,
            y: this.y - v.y,
        });
    }

    multiply(scalar: number): Vector {
        return this.set({
            x: this.x * scalar,
            y: this.y * scalar,
        });
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    set m(val: number) {
        this.set({ m: val, d: this.d });
    }

    set d(val: number) {
        this.set({ m: this.m, d: val });
    }

    get m(): number {
        return Math.sqrt(this.dot(this));
    }

    get d(): number {
        return Math.atan2(this.y, this.x);
    }
}

export default Vector;
