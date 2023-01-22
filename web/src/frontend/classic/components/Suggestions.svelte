<script lang="ts">
    import { ClickableTile, Tile, Tag } from 'carbon-components-svelte';
    import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
    import BookmarkAdd from 'carbon-icons-svelte/lib/BookmarkAdd.svelte';

    import { EventWatcher } from '../stores/Events';
    import { selectedMedia, selectedItem } from '../stores/Stores';

    import type { Bookmark } from '../../../engine/providers/BookmarkPlugin';

    import MediaIcon from '../../../img/media.webp';

    import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
    import type { Check } from '../../../engine/SettingsManager';

    const settings = HakuNeko.SettingsManager.OpenScope();
    let checkNewContent = settings.Get<Check>(GlobalKey.CheckNewContent).Value;
    settings.ValueChanged.Subscribe((sender, shouldCheck: boolean) => {
        if (shouldCheck) refreshSuggestions();
        checkNewContent = shouldCheck;
    });

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

{#if checkNewContent}
    <Tile id="Suggestions" class="border">
        <ClickableTile id="Continue" light>
            <h4 style="text-align:center;">
                Continue
                <BookmarkAdd size={24} />
            </h4>
        </ClickableTile>
        {#each suggestions as bookmark (bookmark.Identifier)}
            <ClickableTile
                class="suggesttile"
                light
                on:click={() => selectBookmark(bookmark)}
            >
                <div
                    class="mediaitem"
                    style="background-image: url({bookmark.Icon ?? MediaIcon});"
                >
                    <Tag class="suggesttitle" type="outline" interactive>
                        <span title={bookmark.Title}>{bookmark.Title}</span>
                    </Tag>

                    {#await bookmark.getUnflaggedContent() then value}
                        <Tag
                            class="suggestcount"
                            type="outline"
                            icon={CaretRight}
                            interactive
                        >
                            {value.length}
                        </Tag>
                    {/await}
                </div>
            </ClickableTile>
        {/each}
    </Tile>
{/if}

<style>
    :global(#Suggestions) {
        display: grid;
        grid-template-columns: repeat(auto-fit, 10em);
        grid-template-rows: auto auto; /* 2 rows */
        grid-auto-rows: 0px; /* next rows equal to 0 */
        grid-gap: 0.5em;
        overflow: hidden;
    }
    :global(#Suggestions #Continue) {
        background-color: var(--cds-background);
    }
    :global(#Suggestions .suggesttile) {
        padding: 0;
    }
    :global(#Suggestions .suggesttile .bx--tag span) {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    :global(#Suggestions .suggesttitle) {
        width: 95%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(#Suggestions .suggestcount) {
        position: absolute;
        bottom: 0;
        right: 0.2em;
    }
    .mediaitem {
        height: 100%;
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>
