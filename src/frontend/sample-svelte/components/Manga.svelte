<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type {IManga } from '../../../engine/MangaProvider';
    
	export let manga: IManga;
    export let selected: Boolean;
    

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

<div class="manga" class:selected="{selected}" on:click={e => dispatch('select',manga) }>{manga.Title}</div>