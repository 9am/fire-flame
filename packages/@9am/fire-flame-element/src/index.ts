import { FireFlame, Vector } from '@9am/fire-flame';
import type { FireFlameOption } from '@9am/fire-flame';

class FireFlameElement extends HTMLElement {
    private _container: HTMLElement;
    private _instance: FireFlame;

    protected static getTemplate(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `<div id="container"></div>`;
        return template;
    }

    static encode(val: FireFlameOption): string {
        return JSON.stringify(val);
    }

    static decode(val: string): FireFlameOption {
        return JSON.parse(val);
    }

    static get observedAttributes(): Array<string> {
        return ['option'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.appendChild(
            FireFlameElement.getTemplate().content.cloneNode(true)
        );
    }

    attributeChangedCallback(name: string, prev: any, next: any): void {
        if (prev === next) {
            return;
        }
        switch (name) {
            case 'option':
                this._instance?.setOption(FireFlameElement.decode(next));
                break;
            default:
                break;
        }
    }

    connectedCallback(): void {
        if (!this.hasAttribute('option')) {
            this.option = {};
        }
        this._container = this.shadowRoot?.querySelector('#container')!;
        this._instance = new FireFlame(this._container, this.option);
    }

    disconnectedCallback(): void {
        this._instance.destroy();
    }

    get option(): FireFlameOption {
        const attr = this.getAttribute('option') || FireFlameElement.encode({});
        return FireFlameElement.decode(attr);
    }

    set option(val: FireFlameOption) {
        this._instance?.setOption(val);
        const attr = FireFlameElement.encode(val);
        this.setAttribute('option', attr);
    }

    get instance(): FireFlame {
        return this._instance;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fire-flame': FireFlameElement;
    }
}
window.customElements.define('fire-flame', FireFlameElement);

export { FireFlameElement as FireFlame, FireFlameOption, Vector };
