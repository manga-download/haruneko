<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();
    import {
        Button,
        ClickableTile,
        //ContextMenu,
        //ContextMenuDivider,
        //ContextMenuOption,
    } from 'carbon-components-svelte';
    import {
        BookmarkFilled as IconBookmarkFilled,
        View,
        ViewFilled,
        CloudDownload,
    } from 'carbon-icons-svelte';

    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { selectedItem } from '../stores/Stores';

    export let item: IMediaContainer;
    export let selected: boolean;
    let flag: FlagType;
    const flagiconmap = new Map<FlagType, any>([
        [FlagType.Viewed, ViewFilled],
        [FlagType.Current, IconBookmarkFilled],
    ]);
    $: flagicon = flagiconmap.get(flag) || View;

    async function OnFlagChangedCallback(
        changedItem: IMediaContainer,
        changedFlag: FlagType
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
    });
</script>

<div
    class="listitem"
    in:fade
    class:selected
    class:active={$selectedItem?.Identifier === item?.Identifier}
    on:click
    on:contextmenu
    on:mousedown
    on:mouseup
    on:mouseenter
>
    <Button
        size="small"
        kind="ghost"
        icon={CloudDownload}
        tooltipPosition="right"
        tooltipAlignment="end"
        iconDescription="Download"
        on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
    />
    <Button
        size="small"
        kind="ghost"
        icon={flagicon}
        tooltipPosition="right"
        tooltipAlignment="end"
        iconDescription="View"
        on:click={() => dispatch('view', item)}
    />
    <ClickableTile
        class="title"
        on:click={(e) => {
            e.preventDefault();
            dispatch('view', item);
        }}
    >
        <span title={item.Title}>{item.Title}</span>
    </ClickableTile>
</div>

<style>
    .listitem {
        display: flex;
        user-select: none;
    }
    .listitem:hover {
        background-color: var(--cds-hover-row);
        --cds-ui-01: var(--cds-hover-row);
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
</style>
