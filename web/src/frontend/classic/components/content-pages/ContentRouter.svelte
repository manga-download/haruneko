<script>
    import { Store as UI } from '../../stores/Stores.svelte';

    import Bookmarks from './Bookmarks.svelte';
    import Main from './Main.svelte';
    import PathBar from './ContentPathBar.svelte';
</script>

<header>
    <PathBar />
</header>

<main>
    {#if UI.contentscreen === '/'}
        <Main />
    {:else if UI.contentscreen === '/bookmarks'}
        <Bookmarks />
    {:else}
        Unkown content screen: {UI.contentscreen}
    {/if}
</main>

<style>
    header {
        height: 2.2em;
    }
    main {
        height: calc(100% - 2.2em);
        overflow-y: auto;
    }
</style>
