<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();
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
    export let display = 'Row';
    let flag: FlagType;

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

{#if display === 'Row'}
    <div
        class="listitem"
        in:fade
        class:selected
        class:active={$selectedItem?.Identifier === item?.Identifier}
        on:click
        on:contextmenu
    >
        <span
            class="download"
            on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
            ><CloudDownload class="download" /></span
        >
        <span class="view" on:click={() => dispatch('view', item)}>
            {#if flag === FlagType.Viewed}
                <ViewFilled />
            {:else if flag === FlagType.Current}
                <IconBookmarkFilled />
            {:else}
                <View />
            {/if}
        </span>
        <span title={item.Title}>{item.Title}</span>
    </div>
{/if}

<style>
    .listitem {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .listitem:hover {
        background-color: var(--cds-hover-row);
    }
    .listitem.selected {
        background-color: var(--cds-selected-ui);
    }
    .listitem.active {
        background-color: var(--cds-active-ui);
    }
    .listitem .view:hover {
        color: var(--cds-hover-ui);
    }
    .listitem .download:hover {
        color: var(--cds-hover-ui);
    }
</style>
