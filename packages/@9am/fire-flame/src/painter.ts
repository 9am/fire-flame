import { FireFlameOption } from './fireflame';
import Vector from './vector';

export interface Painter {
    dom: Element;
    updateSize({ w, h }: { w: number; h: number }): void;
    draw(path: Array<[Vector, Vector]>, option: FireFlameOption): void;
}

class CanvasPainter implements Painter {
    dom: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    protected static getTemplate(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `<canvas width="" height=""></canvas>`;
        return template;
    }

    constructor() {
        this.dom = <HTMLCanvasElement>(
            CanvasPainter.getTemplate().content.firstElementChild!.cloneNode(true)
        );
        this.ctx = this.dom.getContext('2d')!;
    }

    updateSize({ w, h }: { w: number; h: number }) {
        this.dom.setAttribute('width', w + '');
        this.dom.setAttribute('height', h + '');
    }

    draw(path: Array<[Vector, Vector]>, option: FireFlameOption) {
        const { x, y, particleNum, particleDistance, innerColor, outerColor } = option;
        const path2D = new Path2D();
        path.forEach(([p1, p2]) => {
            path2D.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        });
        path2D.closePath();
        // clear
        this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
        // draw
        const gradient = this.ctx.createRadialGradient(
            x!,
            y!,
            Math.random() * 5,
            x!,
            y!,
            particleNum! * particleDistance! * 0.5
        );
        gradient.addColorStop(0, innerColor!);
        gradient.addColorStop(1, outerColor!);
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = gradient;
        this.ctx.fill(path2D);
        this.ctx.filter = 'blur(4px)';
        this.ctx.lineWidth = 4;
        this.ctx.stroke(path2D);
        this.ctx.restore();
    }
}

class SVGPainter implements Painter {
    dom: Element;
    pathStroke: Element;
    pathFill: Element;
    gradient: Element;
    stopInner: Element;
    stopOuter: Element;

    protected static getTemplate(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                    <radialGradient id="ff-gradient" fx="0" gradientTransform="">
                        <stop id="stop-inner" offset="10%" stop-color="blue" />
                        <stop id="stop-outer" offset="75%" stop-color="blueviolet" />
                    </radialGradient>
                </defs>
                <g fill="url('#ff-gradient')">
                    <path class="ff-fill" d="" />
                </g>
                <g
                    stroke="url('#ff-gradient')"
                    stroke-width="4"
                    fill="none"
                    style="filter: blur(4px)"
                >
                    <path class="ff-stroke" d="" />
                </g>
            </svg>
        `;
        return template;
    }

    constructor() {
        this.dom = <Element>(
            SVGPainter.getTemplate().content.firstElementChild!.cloneNode(true)
        );
        this.pathStroke = this.dom.querySelector('.ff-stroke')!;
        this.pathFill = this.dom.querySelector('.ff-fill')!;
        this.gradient = this.dom.querySelector('#ff-gradient')!;
        this.stopInner = this.dom.querySelector('#stop-inner')!;
        this.stopOuter = this.dom.querySelector('#stop-outer')!;
    }

    updateSize({ w, h }: { w: number; h: number }) {
        this.dom.setAttribute('width', w + '');
        this.dom.setAttribute('height', h + '');
    }

    draw(path: Array<[Vector, Vector]>, option: FireFlameOption) {
        const { innerColor, outerColor, wind } = option;
        this.stopInner.setAttribute('stop-color', innerColor!);
        this.stopOuter.setAttribute('stop-color', outerColor!);
        console.log((wind!.d * 180) / Math.PI);
        this.gradient.setAttribute(
            'gradientTransform',
            `rotate(${(wind!.d * 180) / Math.PI} 0.5 0.5)`
        );
        const [s] = path;
        const quadraticCurveTo = path
            .map(
                // prettier-ignore
                ([p1, p2]) => `Q ${Math.ceil(p1.x)},${Math.ceil(p1.y)} ${Math.ceil(p2.x)},${Math.ceil(p2.y)}`
            )
            .join(' ');
        const d = `M ${s?.[0].x},${s?.[0].y} ${quadraticCurveTo} Z`;
        this.pathStroke.setAttribute('d', d);
        this.pathFill.setAttribute('d', d);
    }
}

export { CanvasPainter, SVGPainter };
