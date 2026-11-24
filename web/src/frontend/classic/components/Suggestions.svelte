<script lang="ts">
    import { ClickableTile, Tile, Tag, Layer,    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardMedia,
    CardTitle,
    CardAction,
    Button,
    Truncate,
    Stack,
    ScrollGradient, } from 'carbon-components-svelte';
    import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
    import BookmarkAdd from 'carbon-icons-svelte/lib/BookmarkAdd.svelte';

    import { Store as UI } from '../stores/Stores.svelte';

    import type { Bookmark } from '../../../engine/providers/Bookmark';

    import MediaIcon from '../../../img/media.webp';

    import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
    import type { Check } from '../../../engine/SettingsManager';

    import type {
        MediaContainer,
        MediaItem,
    } from '../../../engine/providers/MediaPlugin';

    const setting = HakuNeko.SettingsManager.OpenScope().Get<Check>(GlobalKey.CheckNewContent);
    let checkNewContent = setting.Value;
    setting.Subscribe(value => {
        if(value) refreshSuggestions();
        checkNewContent = value;
    });

    let suggestions: Bookmark[] = [];
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
        UI.selectedPlugin = HakuNeko.BookmarkPlugin;
        UI.selectedMedia = bookmark;
        UI.selectedItem = unFlaggedContent[
            unFlaggedContent.length - 1
        ] as MediaContainer<MediaItem>;
    }
</script>

{#if checkNewContent}
    <Tile id="Suggestions" class="border" >
    <ScrollGradient >
        <Stack orientation="horizontal" gap={3}>
            <ClickableTile
                id="Continue"
                on:click={() => (UI.contentscreen = '/bookmarks')}
                style="width: 6em"
            >
                <h4 style="text-align:center;">
                    Continue
                    <BookmarkAdd size={24} />
                </h4>
            </ClickableTile>
            {#each suggestions as bookmark (bookmark)}
                <Card horizontal clickable style="height:12em; width: 16em;" on:click={() => selectBookmark(bookmark)}>
                    <CardMedia slot="media" ratio="1x2">
                        <img src={bookmark.Icon ?? MediaIcon} alt="" />
                    </CardMedia>
                    <CardHeader>
                        <CardTitle headingLevel={1} maxWidth="6em">
                            <Truncate reveal="tooltip" lines={3}>{bookmark.Title}</Truncate>
                            <svelte:fragment slot="description">
                                {#await bookmark.GetUnflaggedContent() then value}
                                {#if value.length > 0} 
                                <Tag
                                class="suggestcount"
                                type="outline"
                                icon={CaretRight}
                                interactive
                                >
                                    {value.length}
                                </Tag>
                                {/if}
                                {/await}
                            </svelte:fragment>
                        </CardTitle>

                    </CardHeader>
                </Card>
            {/each}
        </Stack>
    </ScrollGradient>
    </Tile>
{/if}

<style>

</style>