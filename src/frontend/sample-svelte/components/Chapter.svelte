<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    import {
        Icon
    } from "carbon-components-svelte";
    
    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

    import type {IChapter } from '../../../engine/MangaProvider';

	export let chapter: IChapter;
	export let selected: Boolean;
	export let display = 'Row';
</script>
<style>
    .listitem{

        cursor: pointer;
    }
    .listitem:hover{
        background-color: var(--chapter-list-highlighted);
    }
    .listitem.selected {
        background-color: var(--chapter-list-selected);
    }
</style>
{#if display==='Row'}
<div class="listitem" class:selected={selected} >
    <Icon class="download" render={CloudDownload16} on:click={e => dispatch('download',chapter) }/>
    <Icon class="viewer" render={Image16} on:click={e => {console.log('send view');dispatch('view',chapter); }}/>
    <Icon class="bookmark" render={Bookmark16} on:click={e => dispatch('bookmark',chapter) }/>
    {chapter.Title}
</div>
{/if}