<script lang="ts">
    import { Tag, 
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    Box,
    Truncate,
    Stack, } from 'carbon-components-svelte';
    import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
    import { fade } from 'svelte/transition';
    import {Store as UI } from '../../stores/Stores.svelte';
    import MediaIcon from '../../../../img/media.webp';
    import type { Bookmark } from '../../../../engine/providers/Bookmark';
    import type {
        MediaContainer,
        MediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    async function selectBookmark(bookmark: Bookmark) {
        let unFlaggedContent = await bookmark.GetUnflaggedContent();
        UI.selectedPlugin = HakuNeko.BookmarkPlugin;
        UI.selectedMedia = bookmark;
        UI.selectedItem = unFlaggedContent[
            unFlaggedContent.length - 1
        ] as MediaContainer<MediaItem>;
    }
</script>

<div in:fade>
    <Box>
    <Stack orientation="horizontal" wrap="wrap" gap={3}>
        {#each window.HakuNeko.BookmarkPlugin.Entries.Value as bookmark (bookmark)}
            <Card horizontal clickable style="width: 16em" on:click={() => selectBookmark(bookmark)}>
                <CardMedia slot="media" ratio="2x1">
                    <img src={bookmark.Icon ?? MediaIcon} alt="" />
                </CardMedia>
                <CardHeader>
                    <CardTitle maxWidth="6em">
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
    </Box>
</div>