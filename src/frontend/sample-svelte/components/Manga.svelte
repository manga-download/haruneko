<script lang="ts">
	import type {IManga } from '../../../engine/MangaProvider';
	export let manga: IManga;
	export let selected: IManga;
</script>
<style>
	.manga{
        padding-top:2px;
        padding-bottom:2px;
        cursor: pointer;
    }
    .manga:hover{
        background-color: var(--manga-list-highlighted);
    }
    .manga.selected  {
        background-color: var(--manga-list-selected);
    }
</style>

<div class="manga" class:selected="{selected === manga}" on:click={e => selected = manga}>{manga.Title}</div>