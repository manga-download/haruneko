<script lang="ts">
	import type {IManga } from '../../../engine/MangaProvider';
	export let manga: IManga;
	export let selected: IManga;
	export let display = 'li';
</script>
<style>
	li{
        padding-top:2px;
        padding-bottom:2px;
        cursor: pointer;
    }
    li:hover{
        background-color: var(--manga-list-highlighted);
    }
    li.selected  {
        background-color: var(--manga-list-selected);
    }
</style>
{#if display==='li'}
	<li class="manga" class:selected="{selected === manga}" on:click={e => selected = manga}>{manga.Title}</li>
{/if}