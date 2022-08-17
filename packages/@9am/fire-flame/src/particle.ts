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
}

export default Particle;
