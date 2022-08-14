<script lang="ts">
    import { onDestroy, createEventDispatcher } from 'svelte';
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

    export let item: IMediaContainer;
    export let selected: Boolean;
    export let display = 'Row';
    let flag: Promise<FlagType> =
        HakuNeko.ItemflagManager.GetItemFlagType(item);
    let flagtype: FlagType;
    $: flag.then((flag) => (flagtype = flag));

    async function OnFlagChangedCallback(
        changedItem: IMediaContainer,
        changedFlag: FlagType
    ) {
        if (changedItem === item) flagtype = changedFlag;
        else if (changedFlag === FlagType.Current)
            flagtype = await HakuNeko.ItemflagManager.GetItemFlagType(item);
    }
    HakuNeko.ItemflagManager.FlagChanged.Subscribe(OnFlagChangedCallback);
    onDestroy(() => {
        HakuNeko.ItemflagManager.FlagChanged.Unsubscribe(OnFlagChangedCallback);
    });
</script>

{#if display === 'Row'}
    <div class="listitem" in:fade class:selected on:click on:contextmenu>
        <span
            class="download"
            on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
            ><CloudDownload class="download" /></span
        >
        <span class="view" on:click={() => dispatch('view', item)}>
            {#if flagtype === FlagType.Viewed}
                <ViewFilled />
            {:else if flagtype === FlagType.Current}
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
        background-color: var(--cds-hover-ui);
    }
    .listitem.selected {
        background-color: var(--cds-active-ui);
    }
    .listitem .view:hover {
        color: var(--cds-active-ui);
    }
    .listitem .download:hover {
        color: var(--cds-active-ui);
    }
</style>
