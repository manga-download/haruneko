<script lang="ts">
    import { onMount, onDestroy} from 'svelte';
    import { fade } from 'svelte/transition';

    interface Props {
        item: MediaContainer<MediaItem>;
        selected: boolean;
        hover: boolean;
        multilang ?: boolean;
        onView: (MouseEvent) => void;
        onmouseup: (MouseEvent) => void;
        onmousedown: (MouseEvent) => void;
        onmouseenter: (MouseEvent) => void;
    };
    let { item, selected, hover , multilang = false, onView, onmouseup, onmousedown, onmouseenter }: Props  = $props();

    import { Button, ClickableTile } from 'carbon-components-svelte';
    import {
        BookmarkFilled as IconBookmarkFilled,
        CloudDownload,
        Download,
        Error,
        FolderOpen,
        Pause,
        PauseFuture,
        View,
        ViewFilled,
        VolumeFileStorage,
    } from 'carbon-icons-svelte';

    import { Tags, type Tag } from '../../../engine/Tags';
    const availableLanguageTags = Tags.Language.toArray();

    // NOTE: This relies on all language tags having a unicode flag prefix in their corresponding `Title`
    function extractUnicodeFlagFromTags(tags: ReadonlyArray<Tag>): string {
        const languageTagTitleResourceKey = tags.find((tag) =>
            availableLanguageTags.includes(tag),
        )?.Title;
        return (
            $Locale[languageTagTitleResourceKey]
                ?.call(undefined)
                ?.slice(0, 4) ?? '🏴'
        );
    }

    import type {
        MediaItem,
        MediaContainer,
        StoreableMediaContainer,
    } from '../../../engine/providers/MediaPlugin';
    import {
        FlagType,
        type EntryFlagEventData,
    } from '../../../engine/ItemflagManager';
    import { selectedItem } from '../stores/Stores';
    import { Locale } from '../stores/Settings';
    import { DownloadTask, Status } from '../../../engine/DownloadTask';

    let flag: FlagType = $state();
    const flagiconmap = new Map<FlagType, any>([
        [FlagType.Viewed, ViewFilled],
        [FlagType.Current, IconBookmarkFilled],
    ]);

    let flagicon = $derived(flagiconmap.get(flag) || View);

    async function OnFlagChangedCallback(flagData: EntryFlagEventData) {
        if (flagData.Entry === item) {
            flag = flagData.Kind;
        } else if (flagData.Kind === FlagType.Current) {
            flag = await HakuNeko.ItemflagManager.GetItemFlagType(item);
        }
    }
    HakuNeko.ItemflagManager.EntryFlagEventChannel.Subscribe(
        OnFlagChangedCallback,
    );
    onMount(async () => {
        flag = await HakuNeko.ItemflagManager.GetItemFlagType(item);
    });
    onDestroy(() => {
        HakuNeko.ItemflagManager.EntryFlagEventChannel.Unsubscribe(
            OnFlagChangedCallback,
        );
        downloadTask?.Status.Unsubscribe(refreshDownloadStatus);
        HakuNeko.DownloadManager.Queue.Unsubscribe(taskQueueChanged);
    });

    let downloadTask: DownloadTask = $state();

    async function taskQueueChanged(tasks: DownloadTask[]) {
        downloadTask?.Status.Unsubscribe(refreshDownloadStatus);
        downloadTask = tasks.find((task) => task.Media.IsSameAs(item));
        downloadTask?.Status.Subscribe(refreshDownloadStatus);
    }
    HakuNeko.DownloadManager.Queue.Subscribe(taskQueueChanged);

    async function refreshDownloadStatus(_status: Status, _task: DownloadTask) {
        downloadTask = downloadTask;
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="listitem"
    role="listitem"
    in:fade
    class:selected
    class:hover
    class:active={$selectedItem?.Identifier === item?.Identifier}
    {onmouseup}
    {onmousedown}
    {onmouseenter}
>
    <Button
        size="small"
        kind="ghost"
        tooltipPosition="right"
        tooltipAlignment="end"
        iconDescription="Download"
        onclick={() => window.HakuNeko.DownloadManager.Enqueue(item as StoreableMediaContainer<MediaItem>)}
    >
        {#if downloadTask}
            {@const status = downloadTask.Status.Value}
            {#if status === Status.Queued}
                <PauseFuture fill="var(--cds-icon-secondary)" />
            {:else if status === Status.Paused}
                <Pause fill="var(--cds-toggle-off)" />
            {:else if status === Status.Downloading}
                <Download fill="var(--cds-support-info)" />
            {:else if status === Status.Processing}
                <VolumeFileStorage fill="var(--cds-support-info)" />
            {:else if status === Status.Failed}
                <Error fill="var(--cds-support-error-inverse)" />
            {:else if status === Status.Completed}
                <FolderOpen fill="var(--cds-support-03)" />
            {:else}
                <CloudDownload fill="var(--cds-icon-01)" />
            {/if}
        {:else}
            <CloudDownload fill="var(--cds-icon-01)" />
        {/if}
    </Button>
    <Button
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
        padding-left: 0;
        padding-right: 0;
    }
    .listitem :global(button:hover) {
        --cds-icon-01: var(--cds-hover-secondary);
    }
    .multilang {
        opacity: 0.7;
        margin-right: 0.4em;
    }
</style>
