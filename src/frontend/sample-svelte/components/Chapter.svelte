<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    import {
        Row,Column,
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
    <Icon render={CloudDownload16} />
    <Icon render={Image16} on:click={e => dispatch('select',chapter) }/>
    <Icon render={Bookmark16} />
    {chapter.Title}
</div>
{/if}