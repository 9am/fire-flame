<div align="center">
    <img src="https://user-images.githubusercontent.com/1435457/184616572-df451c3a-737c-4e44-84cb-f3348189d7bb.gif" alt="fire-flame" width="180" height="180" />
    <p>A fire flame library 🔥 <a href="https://github.com/9am/9am.github.io/issues/7">Light a 'Fire' with Canvas and Particles</a></p>
    <p>
        <a href="https://github.com/9am/fire-flame/blob/main/packages/%409am/fire-flame-react/README.md">
            <img alt="GitHub" src="https://img.shields.io/github/license/9am/fire-flame?color=success">
        </a>
        <a href="https://www.npmjs.com/package/@9am/fire-flame-react">
            <img alt="npm" src="https://img.shields.io/npm/v/@9am/fire-flame-react?color=orange">
        </a>
        <a href="https://www.npmjs.com/package/@9am/fire-flame-react">
            <img alt="npm" src="https://img.shields.io/npm/dt/@9am/fire-flame-react?color=blue">
        </a>
        <a href="https://bundlephobia.com/package/@9am/fire-flame-react@latest">
            <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@9am/fire-flame-react">
        </a>
    </p>
</div>

---

## Demo
https://user-images.githubusercontent.com/1435457/181478598-803a9822-247f-44e2-8643-3de775900153.mov

## Packages
| Package | Status | Description | Installation | Live Demo |
| ------- | ------ | ----------- | ------------ | --------- |
| [@9am/fire-flame](https://github.com/9am/fire-flame/tree/main/packages/%409am/fire-flame) | [![](https://img.shields.io/npm/v/@9am/fire-flame)](https://npm.im/@9am/fire-flame) | Vanilla JS | `npm install @9am/fire-flame` |  [![Edit fire-flame](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fire-flame-gfdw6f?fontsize=14&hidenavigation=1&theme=dark) |
| [@9am/fire-flame-element](https://github.com/9am/fire-flame/tree/main/packages/%409am/fire-flame-element) | [![](https://img.shields.io/npm/v/@9am/fire-flame-element)](https://npm.im/@9am/fire-flame-element) | Web Component | `npm install @9am/fire-flame-element ` | [![Edit fire-flame-element](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fire-flame-element-4np4yg?fontsize=14&hidenavigation=1&theme=dark) |
| [@9am/fire-flame-react](https://github.com/9am/fire-flame/tree/main/packages/%409am/fire-flame-react) | [![](https://img.shields.io/npm/v/@9am/fire-flame-react)](https://npm.im/@9am/fire-flame-react) | React Component | `npm install @9am/fire-flame-react` | [![Edit fire-flame-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fire-flame-react-gptfe4?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.tsx&theme=dark) |


## Usage

#### [`@9am/fire-flame`](https://github.com/@9am/fire-flame)
```js
import { FireFlame } from '@9am/fire-flame';

const ff = new FireFlame(document.querySelector('#container'), { /* option */ });
```

#### [`@9am/fire-flame-element`](https://github.com/@9am/fire-flame)
```js
import '@9am/fire-flame-element';

// HTML
<fire-flame option='/* JSON.stringify(option) */'></fire-flame>
```

#### [`@9am/fire-flame-react`](https://github.com/@9am/fire-flame)
```js
import { FireFlame } from '@9am/fire-flame-react';

// JSX
<FireFlame option={/* option */}></FireFlame>
```

## Documentation

### Option

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
|**`w`**|number|`400`|width|
|**`h`**|number|`400`|height|
|**`x`**|number|`0`|position x|
|**`y`**|number|`0`|position y|
|**`mousemove`**|boolean|`true`|enable mousemove|
|**`fps`**|number|`60`|render fps|
|**`wind`**|Vector|`new Vector({ x: 0, y: -0.8 })`|the Vector force applied to particles|
|**`friction`**|number|`0.98`|the friction applied to particles|
|**`particleNum`**|number|`15`|the number of particle to draw the flame|
|**`particleDistance`**|number|`10`|the distance between particles|
|**`particleFPS`**|number|`10`|particle spawn fps|
|**`sizeCurveFn`**|function|<pre>() => x > 0.7 <br/>   ? Math.sqrt(1 - x) * 50<br/>   : Math.pow(x - 1, 2) * -30 + 30</pre>|define the size of the flame|
|**`innerColor`**|string|`'blue'`|flame color inner|
|**`outerColor`**|string|`'blueviolet'`|flame color outer|

### API

#### `.start()`
Start fire flame.

#### `.stop()`
Stop fire flame.

#### `.setOption(option)`
Update fire flame options.

#### `.destroy()`
Destroy fire flame.


## License
[MIT](LICENSE)
