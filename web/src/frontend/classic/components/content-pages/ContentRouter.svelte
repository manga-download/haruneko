<script>
    import { contentscreen } from '../../stores/Stores';

    import Bookmarks from './Bookmarks.svelte';
    import Main from './Main.svelte';
    import PathBar from './ContentPathBar.svelte';
</script>

<header>
    <PathBar />
</header>

<main>
    {#if $contentscreen === '/'}
        <Main />
    {:else if $contentscreen === '/bookmarks'}
        <Bookmarks />
    {:else}
        Unkown content screen: {$contentscreen}
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
