<script lang="ts">
    import { onDestroy, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();
    import {
        Bookmark as IconBookmark,
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
        window.HakuNeko.ItemflagManager.GetItemFlagType(item);
    let flagtype: FlagType;
    $: flag.then((flag) => (flagtype = flag));

    function OnFlagChangedCallback(
        changedItem: IMediaContainer,
        changedFlag: FlagType
    ) {
        if (changedItem === item) flagtype = changedFlag;
    }
    HakuNeko.ItemflagManager.FlagChanged.Subscribe(OnFlagChangedCallback);
    onDestroy(() => {
        HakuNeko.ItemflagManager.FlagChanged.Unsubscribe(OnFlagChangedCallback);
    });
    let itemdiv: HTMLElement;
</script>

{#if display === 'Row'}
    <div
        bind:this={itemdiv}
        class="listitem"
        in:fade
        class:selected
        on:click
        on:contextmenu
    >
        <span on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
            ><CloudDownload class="download" /></span
        >
        <span on:click={() => dispatch('view', item)}>
            {#if flagtype === FlagType.Viewed}
                <ViewFilled />
            {:else if flagtype === FlagType.Current}
                <IconBookmarkFilled />
            {:else}
                <View />
            {/if}
        </span>
        {item.Title}
    </div>
{/if}

<style>
    .listitem {
        cursor: pointer;
        user-select: none;
    }
    .listitem:hover {
        background-color: var(--cds-hover-ui);
    }
    .listitem.selected {
        background-color: var(--cds-active-ui);
    }
</style>
