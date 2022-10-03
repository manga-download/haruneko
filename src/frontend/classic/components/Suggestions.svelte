<script lang="ts">
    import Suggestion from './Suggestion.svelte';
    import { EventWatcher } from '../stores/Events';

    const bookmarks = EventWatcher(
        HakuNeko.BookmarkPlugin.Entries,
        HakuNeko.BookmarkPlugin.EntriesUpdated
    );
</script>

<div id="suggestions">
    {#each $bookmarks as bookmark}
        <Suggestion media={bookmark} />
    {/each}
</div>

<style>
    #suggestions {
        display: flex;
        flex-flow: row wrap;
    }
</style>
