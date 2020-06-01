/*
// Vue 2 shim to fake SFC imports in typescript
declare module '*.vue' {
    import vue from 'vue';
    export default vue;
}
*/

// Vue 3 shim to fake SFC imports in typescript
declare module '*.vue' {
    import { defineComponent } from 'vue';
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}