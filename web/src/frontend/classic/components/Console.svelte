<script lang="ts">
    import { InlineNotification } from 'carbon-components-svelte';

    import { fade } from 'svelte/transition';

    interface ConsoleItem {
        type: string;
        text: string;
    }
    let consoleitems: ConsoleItem[] = [];
    // TODO: find a way to not remove the source file/line from the console
    /*    const log = window.console.log.bind(console);
    console.log = (...args: any) => {
        consoleitems = [...consoleitems, { type: 'log', text: args }];
        log.apply(console, args);
    };

    const info = window.console.info.bind(console);
    console.info = (...args: any) => {
        consoleitems = [...consoleitems, { type: 'info', text: args }];
        info.apply(console, args);
    };
    const error = window.console.error.bind(console);
    console.error = (...args: any) => {
        consoleitems = [...consoleitems, { type: 'error', text: args }];
        error.apply(console, args);
    };
    const warn = window.console.warn.bind(console);
    console.warn = (...args: any) => {
        consoleitems = [...consoleitems, { type: 'warn', text: args }];
        warn.apply(console, args);
    };
    
    console.log('console.log from code');
    console.info('console.info from code');
    console.error('console.error from code');
    console.warn('console.warn from code');
*/
    const consoleTypes: Map<string, any> = new Map([
        ['log', 'info-square'],
        ['info', 'info'],
        ['error', 'error'],
        ['warn', 'warning'],
    ]);
</script>

<div id="console">
    {#each consoleitems as consoleitem}
        <div class="consoleitem" transition:fade>
            <InlineNotification
                lowContrast
                kind={consoleTypes.get(consoleitem.type)}
                title={consoleitem.type}
                subtitle={consoleitem.text}
            />
        </div>
    {/each}
</div>

<style>
    #console {
        height: 100%;
        overflow-y: scroll;
    }

    :global(.log) {
        color: black;
        background-color: grey;
    }
    :global(.info) {
        color: black;
        background-color: darkcyan;
    }
    :global(.error) {
        color: white;
        background-color: red;
    }
    :global(.warn) {
        color: black;
        background-color: yellow;
    }
    .consoleitem {
        margin: 0;
    }

    :global(.consoleitem .bx--inline-notification) {
        margin: 0;
        padding: 0.5em 0 0.5em 0;
        min-height: 0;
    }
    :global(.consoleitem .bx--inline-notification__details) {
        margin: 0;
    }
    :global(.consoleitem .bx--inline-notification__icon) {
        margin: 0 0.25em 0 0.25em;
    }

    :global(.consoleitem .bx--inline-notification__text-wrapper) {
        padding: 0em;
    }
    :global(.consoleitem .bx--inline-notification__close-button) {
        height: unset;
    }
</style>
