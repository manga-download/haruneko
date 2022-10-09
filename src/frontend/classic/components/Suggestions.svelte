<script lang="ts">
    import { ClickableTile } from 'carbon-components-svelte';

    import { EventWatcher } from '../stores/Events';
    import { selectedMedia, selectedItem } from '../stores/Stores';

    import type { Bookmark } from '../../../engine/providers/BookmarkPlugin';

    import MediaIcon from '../../../img/media.png';

    let suggestions: Bookmark[] = [];
    async function refreshSuggestions() {
        suggestions =
            await HakuNeko.BookmarkPlugin.getEntriesWithUnflaggedContent();
    }
    refreshSuggestions();

    // on bookmark change
    EventWatcher(
        HakuNeko.BookmarkPlugin.Entries,
        HakuNeko.BookmarkPlugin.EntriesUpdated
    ).subscribe(() => refreshSuggestions());
    // on marks change
    EventWatcher(null, HakuNeko.ItemflagManager.MediaFlagsChanged).subscribe(
        () => refreshSuggestions()
    );

    // on

    async function selectBookmark(bookmark: Bookmark) {
        let unFlaggedContent = await bookmark.getUnflaggedContent();
        $selectedMedia = bookmark;
        $selectedItem = unFlaggedContent[unFlaggedContent.length - 1];
    }
</script>

<div id="suggestions">
    {#each suggestions as bookmark (bookmark.Identifier)}
        <div class="suggestion">
            <ClickableTile
                class="suggestile"
                light
                on:click={() => selectBookmark(bookmark)}
            >
                <div
                    class="mediaitem"
                    style="background-image: url({bookmark.Icon ?? MediaIcon});"
                >
                    <div class="border">{bookmark.Title}</div>
                    <div
                        class="border"
                        style="position: absolute; bottom:0; right:0.2em;"
                    >
                        {#await bookmark.getUnflaggedContent() then value}
                            ({value.length})
                        {/await}
                    </div>
                </div>
            </ClickableTile>
        </div>
    {/each}
</div>

<style>
    #suggestions {
        display: flex;
        flex-flow: row wrap;
    }
    .suggestion > :global(.suggestile) {
        height: 7em;
        width: 7em;
        margin: 0.2em;
        padding: 0;
    }
    .mediaitem {
        height: 100%;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 1em;
    }
    .mediaitem:hover {
        color: var(--cds-interactive-02);
    }
    .border {
        border: 2px solid var(--cds-ui-04);
        border-radius: 1em;
        background-color: var(--cds-ui-03);
        padding-left: 0.2em;
    }
</style>
