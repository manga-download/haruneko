// Svelte shim to fake Component imports in typescript
declare module "*.svelte" {

    interface IComponentOptions {
        target: HTMLElement;
        anchor?: HTMLElement | null;
        props?: {};
        hydrate?: boolean;
        intro?: boolean;
    }

    interface IComponent {
        new (options: IComponentOptions): any;
        // client-side methods
        $set(props: {}): void;
        $on(event: string, callback: (event: CustomEvent) => void): void;
        $destroy(): void;
        // server-side methods
        render(props?: {}): {
            html: string;
            css: { code: string; map: string | null };
            head?: string;
        };
    }

    const Component: IComponent;
    export default Component;
}