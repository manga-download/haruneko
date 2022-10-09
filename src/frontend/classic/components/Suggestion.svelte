<script lang="ts">
    import { selectedMedia, selectedItem } from '../stores/Stores';
    import { ClickableTile } from 'carbon-components-svelte';
    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';

    import MediaIcon from '../../../img/media.png';
    export let media: IMediaContainer;

    //Check if media has unviewed content
    let unFlaggedContent: IMediaContainer[] = [];

    import { EventWatcher } from '../stores/Events';
    const mediaFlagsChanged = EventWatcher(
        null,
        HakuNeko.ItemflagManager.MediaFlagsChanged,
        media
    );
    $: $mediaFlagsChanged, findMediaUnFlaggedContent(media);

    async function findMediaUnFlaggedContent(media) {
        unFlaggedContent = await HakuNeko.ItemflagManager.GetUnFlaggedItems(
            media
        );
    }
</script>

{#if unFlaggedContent.length > 0}
    <div class="suggestion">
        <ClickableTile
            class="suggestile"
            light
            on:click={() => (
                ($selectedMedia = media),
                ($selectedItem = unFlaggedContent[unFlaggedContent.length - 1])
            )}
        >
            <div
                class="mediaitem"
                style="background-image: url({media.Icon ?? MediaIcon});"
            >
                <div class="border">{media.Title}</div>
                <div
                    class="border"
                    style="position: absolute; bottom:0; right:0.2em;"
                >
                    ({unFlaggedContent.length})
                </div>
            </div>
        </ClickableTile>
    </div>
{/if}

<style>
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
