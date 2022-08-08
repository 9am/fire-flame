import { FireFlame, Vector } from '@9am/fire-flame';
import '@9am/fire-flame';

const vinalla = new FireFlame(<HTMLElement>document.querySelector('#app'));

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
    vinalla.setOption(option);
});

vinalla.set({ x: 200, y: 200 });
