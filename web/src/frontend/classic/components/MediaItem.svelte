<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher, SvelteComponent } from 'svelte';
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
        CarbonIcon,
        View,
        ViewFilled,
        CloudDownload,
    } from 'carbon-icons-svelte';

    import { filterByCategory, Tags } from '../../../engine/Tags';

    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { selectedItem } from '../stores/Stores';
    import { Locale } from '../stores/Settings';

    export let item: IMediaContainer;
    export let selected: boolean;
    export let multilang = false;
    const flagiconmap: Record<FlagType, typeof CarbonIcon> = {
        [FlagType.None]: View,
        [FlagType.Viewed]: ViewFilled,
        [FlagType.Current]: IconBookmarkFilled,
    };
    let flagicon: typeof CarbonIcon = View;

    async function OnFlagChangedCallback(
        changedItem: IMediaContainer,
        changedFlag: FlagType
    ) {
        if (changedItem === item) flagicon = flagiconmap[changedFlag];
        else if (changedFlag === FlagType.Current)
            flagicon = flagiconmap[await HakuNeko.ItemflagManager.GetFlag(item)];
    }
    HakuNeko.ItemflagManager.FlagChanged.Subscribe(OnFlagChangedCallback);
    onMount(async () => {
        flagicon = flagiconmap[await HakuNeko.ItemflagManager.GetFlag(item)];
    });
    onDestroy(() => {
        HakuNeko.ItemflagManager.FlagChanged.Unsubscribe(OnFlagChangedCallback);
    });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
    class="listitem"
    role="listitem"
    in:fade
    class:selected
    class:active={$selectedItem?.Identifier === item?.Identifier}
    on:click
    on:contextmenu
    on:mousedown
    on:mouseup
    on:mouseenter
    on:keypress
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
    .multilang {
        font-family: BabelStoneFlags;
        opacity: 0.7;
        margin-right: 0.4em;
    }
</style>
