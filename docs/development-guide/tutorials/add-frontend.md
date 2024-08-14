# Add Front-End

HakuNeko has support for multiple frontends which may have a completely different look and feel depending on the authors taste.
For example, one frontend may look like a mobile manga reading app, while another may look like a full-fledged manga library manager.
This tutorial shows how to get started with creating an additional new frontend for HakuNeko.
It is assumed that the corresponding development environment is set up and the source code is present in a local repository.

The first thing to do when adding a new frontend is to define a `Name` that is shown in the UI and an `ID` which must be unique between alle existing frontends.
In this tutorial we will use the name `Sheep UI` and `sheep-ui` as identifier.

## Common Setup

Create a new folder within the directory `/src/frontend`, which will hold all frontend specific source code.
It is recommend to use the `ID` of the frontend, e.g. `/src/frontend/sheep-ui`.

### The Frontend Info

Next we are going to create a file that will hold the description of the new frontend: `/src/frontend/sheep-ui/FrontendInfo.ts`.

<details>
<summary>FrontendInfo.ts</summary>

```typescript
import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'sheep-ui',
    Label: 'Sheep UI',
    Description: 'A sample tutorial frontend targeting developers ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};
```

</details>

Most of this file should be self explanatory.
The essential part is the `LoadModule` method, which provides the underlying mechanism to load the frontend.
It is implemted as dynamic import instead of a static import to support code splitting.
That means, the frontend itself is not bundled into the HakuNeko package, but each frontend comes in its own bundle.
Therefore HakuNeko will only load the active frontend during runtime and is not bloated with all frontends.

### The Frontend

...

<details>
<summary>Frontend.ts</summary>

```typescript
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';

class SheepUI implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        const app = document.createElement('div');
        app.textContent = 'Sheep UI Frontend';
        // Mount frontend into the given root node
        root.replaceChildren(app);
        // Wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SheepUI();
```

</details>

### Registration

Basically the new frontend is ready, but it still needs to be exposed to the list of available frontends.
Open the existing file `/src/frontend/FrontendController.ts` and add the import for our frontend information we just created.
Also add the information to the defined list of available frontends.

<details>
<summary>FrontendController.ts</summary>

```typescript
/* some other code */
import { Info as InfoSheepUI } from './sheep-ui/FrontendInfo';
/* some other code */
const frontendList: IFrontendInfo[] = [
    /* some other code */
    InfoSheepUI
];
/* some other code */
```

</details>

## Choosing a Framework

At this point our frontend is added to HakuNeko, but currently it is still empty.
To build the UI there are various options from which one can be choosen:

- Svelte
- Vue
- React
- Web Components (e.g. Lit)
- Vanilla JS (you will not doing this 😅)

::: warning IMPORTANT
When choosing a framework, the whole frontend must be developed in this framework. It will not be possible to mix hybrid components (e.g. Svelte + Vue)
:::

### Using Svelte

Create a svelte component such as `/src/frontend/sheep-ui/App.svelte`, presenting the entry point for our frontend.

<details>
<summary>App.svelte</summary>

```svelte
<script lang="ts">
	let count: number = 0;
	function increment() {
		count++;
	}
</script>

<style>
    #container {
        height: 100%;
        padding: 2em;
        text-align: center;
        background-color: lightgrey;
    }
    button {
        padding: 0.5em;
    }
</style>

<div id="container">
    <h3>Hello Svelte Button</h3>
    <button on:click={increment}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
</div>
```

</details>

Modify the frontend to load the svelte app component.

<details>
<summary>Frontend.ts</summary>

```typescript
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class SampleSvelte implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        // Mount svelte app
        new App({ target: root, props: {} });
        // Wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleSvelte();
```

</details>

### Using Vue

Create a vue component such as `/src/frontend/sheep-ui/App.vue`, presenting the entry point for our frontend.

<details>
<summary>App.vue</summary>

```vue
<script setup lang="ts">
    import { ref } from 'vue';

    const count = ref(0);
    const increment = () => {
        count.value++;
    };
</script>

<style scoped>
    #container {
        height: 100%;
        padding: 2em;
        text-align: center;
        background-color: lightgrey;
    }
    button {
        padding: 0.5em;
    }
</style>

<template>
    <div id="container">
        <h3>Hello Vue Button</h3>
        <button @click="increment">
            Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}
        </button>
    </div>
</template>
```

</details>

Modify the frontend to load the vue app component.

<details>
<summary>Frontend.ts</summary>

```typescript
import { createApp } from 'vue';
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class SampleVue implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        // Mount vue app
        createApp(App).mount(root);
        // Wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleVue();
```

</details>

### Using React

Create a react component such as `/src/frontend/sheep-ui/App.tsx`, presenting the entry point for our frontend.

<details>
<summary>App.tsx</summary>

```tsx
// TODO: Currently svelte-check transforms all .svelte components to .tsx representations to leverage typescripts tsx capabilities,
//       svelte-check also uses its own type definitions for the transformed .tsx (which are not compatible with the definitions from react)
//       See: https://github.com/sveltejs/language-tools/blob/master/packages/svelte2tsx/svelte-jsx.d.ts
//       As a result, svelte-check will report false positives when type checking real react TSX components ...
//       Further reading: https://github.com/sveltejs/language-tools/issues/1256#issuecomment-983371138
//       Temporary solution: use '--use-new-transformation' flag for svelte-check

import * as React from 'react';
import { CSSProperties, useState } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        height: '100%',
        padding: '2em',
        textAlign: 'center',
        backgroundColor: 'lightgrey'
    },
    button: {
        padding: '0.5em'
    }
};

export default function App() {

    const [ count, setCount ] = useState(0);

    return (
        <div style={styles.container}>
            <h3>Hello React Button</h3>
            <button style={styles.button} onClick={() => setCount(count + 1)}>
                Clicked: {count}
            </button>
        </div>
    );
}
```

</details>

Modify the frontend to load the react app component.

<details>
<summary>Frontend.ts</summary>

```typescript
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { IFrontendModule } from '../IFrontend';
//import type { IWindowController } from '../WindowController';
import App from './App';

class SampleReact implements IFrontendModule {
    async Render(root: HTMLElement/*, windowController: IWindowController*/): Promise<void> {
        const app = createElement(App as React.FunctionComponent<JSX.Element>);
        createRoot(root).render(app);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleReact();
```

</details>

### Using Lit

Create a web component such as `/src/frontend/sheep-ui/App.ts`, presenting the entry point for our frontend.

::: info NOTE
Due to a [bug](https://github.com/lit/lit/issues/2716) it might be required to set `useDefineForClassFields: false` in `tsconfig.json` for correct [field decorator handling](https://github.com/microsoft/TypeScript/issues/48814).
:::

<details>
<summary>App.ts</summary>

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('lit-app')
export default class App extends LitElement {

    static styles = css`
        :host {
            display: block;
            height: 100%;
            background-color: lightgrey;
        }
        #container {
            padding: 2em;
            text-align: center;
        }
        button {
            padding: 0.5em;
        }
    `;

    @state()
    private count = 0;

    private increment(): void {
        this.count++;
    }

    render() {
        return html`
            <div id="container">
                <h3>Hello Lit Button</h3>
                <button @click=${this.increment}>
                    Clicked ${this.count} ${ this.count === 1 ? 'time' : 'times' }
                </button>
            </div>
        `;
    }
}
```

</details>

Modify the frontend to load the web component.

<details>
<summary>Frontend.ts</summary>

```typescript
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleLit implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        root.appendChild(new App());
    }
}

export default new SampleLit();
```

</details>

## Important APIs

Now that the new frontend is ready, it is necessary to talk about accessing content which shall be shown in the UI.
Basically it is allowed to use all functionalities that would be available if the frontend would have been designed as website, e.g. the `window` global.
It must be avoided to use any client depending globals such as `electron`, `nw` or `import os from 'os'`!
Any such calls must only be done through the HakuNeko engine.
Of course it is allowed to import various types or modules for compilation since this have no effect on runtime (e.g. `import type { MangaPlugin } from '../engine/MangaPlugin'`).
This strict rule is applied to make it easier in case of a future migration for whatever reason (e.g. to `electron`, `PWA` or `Chrome Extension`).

### HakuNeko Engine

TBD ...

### FrontendController

TBD ...