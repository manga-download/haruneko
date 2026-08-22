<script lang="ts">
    interface Props {
        item: MediaContainer<MediaItem>;
        // Provided by the parent MediaItemSelect (single centralized subscriptions):
        flag?: FlagType;
        task?: DownloadTask;
        taskStatus?: Status;
        selected: boolean;
        hover: boolean;
        multilang?: boolean;
        onView: (MouseEvent) => void;
        onmouseup: (MouseEvent) => void;
        onmousedown: (MouseEvent) => void;
        onmouseenter: (MouseEvent) => void;
    };
    let {
        item,
        flag,
        task: downloadTask,
        taskStatus: downloadTaskStatus,
        selected,
        hover,
        multilang = false,
        onView,
        onmouseup,
        onmousedown,
        onmouseenter,
    }: Props  = $props();

    import { Button, ClickableTile } from 'carbon-components-svelte';
    import BookmarkFilled from 'carbon-icons-svelte/lib/BookmarkFilled.svelte';
    import CloudDownload from 'carbon-icons-svelte/lib/CloudDownload.svelte';
    import Download from 'carbon-icons-svelte/lib/Download.svelte';
    import EventIncident from 'carbon-icons-svelte/lib/EventIncident.svelte';
    import FolderOpen from 'carbon-icons-svelte/lib/FolderOpen.svelte';
    import Pause from 'carbon-icons-svelte/lib/Pause.svelte';
    import PauseFuture from 'carbon-icons-svelte/lib/PauseFuture.svelte';
    import View from 'carbon-icons-svelte/lib/View.svelte';
    import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
    import VolumeFileStorage from 'carbon-icons-svelte/lib/VolumeFileStorage.svelte';
    import type {
        MediaItem,
        MediaContainer,
        StoreableMediaContainer,
    } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { Store as UI } from '../stores/Stores.svelte';
    import { DownloadTask, Status } from '../../../engine/DownloadTask';
    import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
    import type { Directory } from '../../../engine/SettingsManager';
    import { GlobalSettings } from '../stores/Settings.svelte';
    
    import { Tags, type Tag } from '../../../engine/Tags';
    const availableLanguageTags = Tags.Language.toArray();

    // NOTE: This relies on all language tags having a unicode flag prefix in their corresponding `Title`
    function extractUnicodeFlagFromTags(tags: ReadonlyArray<Tag>): string {
        const languageTagTitleResourceKey = tags.find((tag) =>
            availableLanguageTags.includes(tag),
        )?.Title;
        return (
            GlobalSettings.Locale[languageTagTitleResourceKey]
                ?.call(undefined)
                ?.slice(0, 4) ?? '🏴'
        );
    }

    const flagiconmap = new Map<FlagType, any>([
        [FlagType.Viewed, ViewFilled],
        [FlagType.Current, BookmarkFilled],
    ]);

    let flagicon = $derived(
        (flag !== undefined && flagiconmap.get(flag)) || View,
    );

    async function addDownload(item: StoreableMediaContainer<MediaItem>) {
        try {
            await HakuNeko.SettingsManager.OpenScope().Get<Directory>(GlobalKey.MediaDirectory).EnsureAccess();
        } catch(error) {
            // TODO: Use appropriate error visualization ...
            alert(error?.message ?? error);
            return;
        }
        await window.HakuNeko.DownloadManager.Enqueue(item);
    }

    async function removeDownload(task: DownloadTask) {
        await window.HakuNeko.DownloadManager.Dequeue(task)
    }

    // TODO: download complete button should open file explorer
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="listitem"
    role="listitem"
    class:selected
    class:hover
    class:active={UI.selectedItem?.Identifier === item?.Identifier}
    {onmouseup}
    {onmousedown}
    {onmouseenter}
>
    {#if !downloadTaskStatus}
        <Button
            role="download"
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            icon={CloudDownload}
            iconDescription="Download"
            onclick={() => addDownload(item as StoreableMediaContainer<MediaItem>)}
        />
    {:else if downloadTaskStatus === Status.Queued}
        <Button
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            iconDescription="Cancel"
            onclick={() => addDownload(item as StoreableMediaContainer<MediaItem>)}
        >
            <PauseFuture fill="var(--cds-icon-secondary)" />
        </Button>
    {:else if downloadTaskStatus === Status.Paused}
        <Button
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            iconDescription="Cancel (paused)"
            onclick={() => downloadTask && removeDownload(downloadTask)}
        >
            <Pause fill="var(--cds-toggle-off)" />
        </Button>
    {:else if downloadTaskStatus === Status.Downloading}
        <Button
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            iconDescription="Cancel (downloading...)"
            onclick={() => downloadTask && removeDownload(downloadTask)}
        >
            <Download fill="var(--cds-support-info)" />
        </Button>

    {:else if downloadTaskStatus === Status.Processing}
        <Button
            size="small"
            kind="ghost"
            iconDescription="Cancel (processing...)"
            onclick={() => downloadTask && removeDownload(downloadTask)}
        >
            <VolumeFileStorage fill="var(--cds-support-info)" />
        </Button>
    {:else if downloadTaskStatus === Status.Failed}
        <Button
            size="small"
            kind="danger-ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            icon={EventIncident}
            iconDescription="Error: click to retry (detailed error in download tasks)"
            onclick={() => downloadTask?.Run()}
        />
    {:else if downloadTaskStatus === Status.Completed}
        <Button
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            iconDescription="Download complete"
            onclick={() => alert('Download complete. TODO: open folder using system explorer')}
        >
            <FolderOpen fill="var(--cds-support-03)" />
        </Button>
    {:else}
        <Button
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="end"
            iconDescription="Download"
            onclick={() => addDownload(item as StoreableMediaContainer<MediaItem>)}
        >
            <CloudDownload fill="var(--cds-icon-01)" />
        </Button>
    {/if}
    <Button
        role="preview"
        size="small"
        kind="ghost"
        icon={flagicon}
        tooltipPosition="right"
        tooltipAlignment="end"
        iconDescription="View"
        onclick={(event) => onView(event)}
    />
    <ClickableTile class="title" onclick={(event) => onView(event)}>
        {#if multilang}
            <span class="multilang">
                {extractUnicodeFlagFromTags(item.Tags.Value)}
            </span>
        {/if}
        <span title={item.Title}>{item.Title}</span>
    </ClickableTile>
</div>

<style>
    .listitem {
        display: flex;
        user-select: none;
    }
    .listitem:hover,
    .listitem.hover {
        background-color: var(--cds-hover-row);
        --cds-ui-01: var(--cds-hover-row);
    }
    .listitem.hover {
        background-color: var(--cds-active-secondary);
        --cds-ui-01: var(--cds-active-secondary);
    }
    .listitem.selected {
        background-color: var(--cds-selected-ui);
        --cds-ui-01: var(--cds-selected-ui);
    }
    .listitem.active {
        background-color: var(--cds-active-ui);
        --cds-ui-01: var(--cds-active-ui);
    }
    .listitem :global(.title) {
        flex: auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-height: unset;
        display: flex;
        align-items: center;
        padding: 0;
        padding-left: 0.5em;
    }
    .listitem :global(button) {
        min-height: unset;
        width: unset;
        min-width: unset;
        padding-left: 0.3em;
        padding-right:0;
    }
    .listitem :global(button:hover) {
        --cds-icon-01: var(--cds-hover-secondary);
    }
    .multilang {
        opacity: 0.7;
        margin-right: 0.4em;
    }
</style>
