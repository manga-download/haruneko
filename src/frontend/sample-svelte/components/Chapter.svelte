<script lang="ts">
    import {
        Row,Column,
        Icon
    } from "carbon-components-svelte";
    
    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

	import type {IChapter } from '../../../engine/MangaProvider';
	export let chapter: IChapter;
	export let selected: IChapter;
	export let display = 'Row';
</script>
<style>
    .listitem{
        padding-top:2px;
        padding-bottom:2px;
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
<div class="listitem" class:selected={selected === chapter}>
    <Row >
        <Column sm={1} md={1} lg={1}><Icon render={CloudDownload16} /></Column>
        <Column sm={1} md={1} lg={1}><Icon render={Image16} on:click={e => selected = chapter}/></Column>
        <Column sm={1} md={1} lg={1}><Icon render={Bookmark16} /></Column>
        <Column sm={1} md={4} lg={8}>{chapter.Title}</Column>
    </Row>
</div>

{/if}