<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    const dispatch = createEventDispatcher();

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

    import { filterByCategory, Tags } from '../../../engine/Tags';

    import type {
        StoreableMediaContainer,
        MediaItem,
    } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { selectedItem, DownloadTasks } from '../stores/Stores';
    import { Locale } from '../stores/Settings';
    import { DownloadTask, Status } from '../../../engine/DownloadTask';
    export let item: StoreableMediaContainer<MediaItem>;
    export let selected: boolean;
    export let hover: boolean;
    export let multilang = false;
    let flag: FlagType;
    const flagiconmap = new Map<FlagType, any>([
        [FlagType.Viewed, ViewFilled],
        [FlagType.Current, IconBookmarkFilled],
    ]);
    $: flagicon = flagiconmap.get(flag) || View;

    async function OnFlagChangedCallback(
        changedItem: StoreableMediaContainer<MediaItem>,
        changedFlag: FlagType,
    ) {
        if (changedItem === item) flag = changedFlag;
        else if (changedFlag === FlagType.Current)
            flag = await HakuNeko.ItemflagManager.GetItemFlagType(item);
    }
    HakuNeko.ItemflagManager.FlagChanged.Subscribe(OnFlagChangedCallback);
    onMount(async () => {
        flag = await HakuNeko.ItemflagManager.GetItemFlagType(item);
    });
    onDestroy(() => {
        HakuNeko.ItemflagManager.FlagChanged.Unsubscribe(OnFlagChangedCallback);
        downloadTask?.StatusChanged.Unsubscribe(refreshDownloadStatus);
        tasksunsubscribe();
    });

    let downloadTask: DownloadTask;

    let tasksunsubscribe = DownloadTasks.subscribe((tasks) => {
        downloadTask?.StatusChanged.Unsubscribe(refreshDownloadStatus);
        downloadTask = tasks.find(
            (task) => task.Media.Identifier === item.Identifier,
        );
        downloadTask?.StatusChanged.Subscribe(refreshDownloadStatus);
    });

    async function refreshDownloadStatus(_sender, status) {
        downloadTask = downloadTask;
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
    class="listitem"
    role="listitem"
    in:fade
    class:selected
    class:hover
    class:active={$selectedItem?.Identifier === item?.Identifier}
    on:click
    on:mousedown
    on:mouseup
    on:mouseenter
    on:keypress
>
    <Button
        size="small"
        kind="ghost"
        tooltipPosition="right"
        tooltipAlignment="end"
        iconDescription="Download"
        on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
    >
        {#if downloadTask}
            {@const status = downloadTask.Status}
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
        on:click={(event) => dispatch('view', event)}
    />
    <ClickableTile class="title" on:click={(event) => dispatch('view', event)}>
        {#if multilang}
            <span class="multilang">
                {multilang
                    ? $Locale[
                          filterByCategory(item.Tags, Tags.Language)[0].Title
                      ]().substring(0, 4)
                    : ''}
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
        font-family: BabelStoneFlags;
        opacity: 0.7;
        margin-right: 0.4em;
    }
</style>
