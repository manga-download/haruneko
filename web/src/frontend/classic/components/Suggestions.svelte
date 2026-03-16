<script lang="ts">
    import { ClickableTile, Tile, Tag } from 'carbon-components-svelte';
    import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
    import BookmarkAdd from 'carbon-icons-svelte/lib/BookmarkAdd.svelte';

    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
        contentscreen,
    } from '../stores/Stores';

    import type { Bookmark } from '../../../engine/providers/Bookmark';

    import MediaIcon from '../../../img/media.webp';

    import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
    import type { Check } from '../../../engine/SettingsManager';

    import type {
        MediaContainer,
        MediaItem,
    } from '../../../engine/providers/MediaPlugin';

    const setting = HakuNeko.SettingsManager.OpenScope().Get<Check>(GlobalKey.CheckNewContent);
    let checkNewContent = $state(setting.Value);
    setting.Subscribe(value => {
        if(value) refreshSuggestions();
        checkNewContent = value;
    });

    let suggestions: Bookmark[] = $state([]);
    let isRefreshing = false;
    async function refreshSuggestions() {
        if (isRefreshing) return;
        isRefreshing = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        suggestions = await HakuNeko.BookmarkPlugin.GetEntriesWithUnflaggedContent();
        isRefreshing = false;
    }
    refreshSuggestions();

    HakuNeko.BookmarkPlugin.Entries.Subscribe(() => refreshSuggestions());
    HakuNeko.ItemflagManager.ContainerFlagsEventChannel.Subscribe(() => refreshSuggestions());

    async function selectBookmark(bookmark: Bookmark) {
        let unFlaggedContent = await bookmark.GetUnflaggedContent();
        $selectedPlugin = HakuNeko.BookmarkPlugin;
        $selectedMedia = bookmark;
        $selectedItem = unFlaggedContent[
            unFlaggedContent.length - 1
        ] as MediaContainer<MediaItem>;
    }
</script>

{#if checkNewContent}
    <Tile id="Suggestions" class="border">
        <ClickableTile
            id="Continue"
            on:click={() => ($contentscreen = '/bookmarks')}
        >
            <h4 style="text-align:center;">
                Continue
                <BookmarkAdd size={24} />
            </h4>
        </ClickableTile>
        {#each suggestions as bookmark (bookmark)}
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

                    {#await bookmark.GetUnflaggedContent() then value}
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
        grid-gap: 0.5em;
        overflow-y: hidden;
        max-height: 18em;
    }

    :global(#Suggestions .suggesttile) {
        height: 8em;
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
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
    }
</style>
