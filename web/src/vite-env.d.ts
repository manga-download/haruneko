/// <reference types="vite/client" />
/// <reference types="svelte" />

declare module '*?raw' {
    const content: string;
    export default content;
}

declare module '*?base64' {
    const content: string;
    export default content;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, unknown>;
    export default component;
}