import { FireFlame, Vector } from '@9am/fire-flame-element';
import '@9am/fire-flame';

const webcomponent = <FireFlame>document.querySelector('fire-flame');

const valueMap = new Map([
    ['number', ['value', Number]],
    ['color', ['value', String]],
    ['checkbox', ['checked', Boolean]],
]);

const getInputValues = (container: Element) => {
    return Array.from(container.querySelectorAll('input')).reduce((memo, node) => {
        const [attr, adaptor] = valueMap.get(node.type) ?? ['value', String];
        return {
            ...memo,
            [node.id]: adaptor(node[attr]),
        };
    }, {});
};

const ctrl = document.querySelector('#ctrl');
ctrl!.addEventListener('change', () => {
    const values = getInputValues(ctrl!);
    console.table(values);
    const option = {
        ...values,
        wind: new Vector({ x: values.windX, y: values.windY }),
    };
    // webcomponent.instance.setOption(option);
    webcomponent.option = option;
});
