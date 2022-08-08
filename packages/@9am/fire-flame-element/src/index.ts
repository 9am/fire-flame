import { FireFlame, Vector } from '@9am/fire-flame';
import type { FireFlameOption } from '@9am/fire-flame';

class FireFlameElement extends HTMLElement {
    private container: HTMLElement;
    private _instance: FireFlame;

    protected static getTemplate(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `<div id="container"></div>`;
        return template;
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
                this.option = JSON.parse(next);
                break;
            default:
                break;
        }
    }

    connectedCallback(): void {
        if (!this.hasAttribute('option')) {
            this.option = {};
        }
        this.container = this.shadowRoot?.querySelector('#container')!;
        this._instance = new FireFlame(this.container, this.option);
    }

    disconnectedCallback(): void {
        this._instance.destroy();
    }

    get option(): FireFlameOption {
        const optionAttr = this.getAttribute('option') || '{}';
        return JSON.parse(optionAttr);
    }

    set option(val: FireFlameOption) {
        this.setAttribute('option', JSON.stringify(val));
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
