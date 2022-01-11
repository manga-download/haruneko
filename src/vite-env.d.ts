/// <reference types="vite/client" />
/// <reference types="svelte" />

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

/*
// Vue 3 shim to fake SFC imports in typescript
declare module '*.vue' {
    import { defineComponent } from 'vue';
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}
*/

/*
// Vue 2 shim to fake SFC imports in typescript
declare module '*.vue' {
    import vue from 'vue';
    export default vue;
}
*/