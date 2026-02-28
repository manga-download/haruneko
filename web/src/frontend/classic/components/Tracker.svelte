<script lang="ts">
    import {
        Loading,
        Accordion,
        AccordionItem,
        Button,
        Modal,
    } from 'carbon-components-svelte';
    import CheckmarkOutline from 'carbon-icons-svelte/lib/CheckmarkOutline.svelte';
    import { fade } from 'svelte/transition';

    import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
    import type {
        MediaInfoTracker,
        Suggestion,
        Info,
    } from '../../../engine/trackers/IMediaInfoTracker';

    interface Props {
        media: MediaContainer<MediaChild>;
        tracker: MediaInfoTracker;
        isTrackerModalOpen?: boolean;
    }
    let { media, tracker, isTrackerModalOpen = $bindable(false) }: Props = $props();

    let mediaSuggestions: Promise<Suggestion[]> = $state();
    let mediaTracked: Info = $state();

    // Only refresh when media.Title changes
    $effect(() => {
        const title = media.Title;
        mediaSuggestions = tracker.Search(title);
        mediaTracked = undefined;
    });

    //Todo: give it some polish !
</script>

<Modal
    id="trackerModal"
    size="lg"
    hasScrollingContent
    bind:open={isTrackerModalOpen}
    passiveModal
    modalHeading="Tracker"
    on:click:button--secondary={() => (isTrackerModalOpen = false)}
    on:open
    on:close
    hasForm
>
    <div class="border">
        <h1><img alt={tracker.Title} src={tracker.Icon} />{tracker.Title}</h1>
    </div>

    {#if mediaTracked}
        <div class="border" in:fade>
            <img class="cover" src={mediaTracked.Cover} alt="" />
            <p><span class="mediainfo">Type</span>: {mediaTracked.Type}</p>
            <p><span class="mediainfo">Title</span>: {mediaTracked.Title}</p>
            <p><span class="mediainfo">Titles</span>: {mediaTracked.Titles}</p>
            <p>
                <span class="mediainfo">Creator</span>: {mediaTracked.Creator}
            </p>
            <p>
                <span class="mediainfo">Released</span>: {mediaTracked.Released.toISOString().substring(
                    0,
                    10
                )}
            </p>
            <p>
                <span class="mediainfo">Description</span>: {mediaTracked.Description}
            </p>
        </div>
    {:else}
        <div class="border" in:fade>
            {#await mediaSuggestions}
                <Loading withOverlay={false} />
                <p>...looking for suggestions</p>
            {:then mediaSuggestions}
                <Accordion>
                    {#each mediaSuggestions as mediaSuggestion}
                        <AccordionItem title={mediaSuggestion.Title}>
                            <p>
                                <span class="mediainfo">Type</span>: {mediaSuggestion.Type}
                            </p>
                            <p>
                                <span class="mediainfo">Titles</span>:
                                <span class="mediainfo-titles"
                                    >{mediaSuggestion.Titles}</span
                                >
                            </p>
                            <Button
                                iconDescription="Track this media"
                                icon={CheckmarkOutline}
                                kind="secondary"
                                on:click={async () =>
                                    (mediaTracked = await tracker.GetInfo(
                                        mediaSuggestion.Identifier
                                    ))}
                            />
                        </AccordionItem>
                    {/each}
                </Accordion>
            {:catch error}
                <p class="error">Meh, it failed : {error}</p>
            {/await}
        </div>
    {/if}
</Modal>

<style>
    .cover {
        float: left;
        width: 12em;
        height: 12em;
        display: block;
        margin-right: 1em;
        border-radius: 10%;
    }
    .mediainfo {
        font-weight: bold;
    }
    .mediainfo-titles {
        font-style: italic;
    }
    .error {
        color: red;
    }
</style>
