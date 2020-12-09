
<script lang="ts">
    import {
        Button,
        Search,
        Dropdown,
        InlineLoading,
    } from "carbon-components-svelte";
    import EarthFilled16 from "carbon-icons-svelte/lib/EarthFilled16";
    
    import { fade } from 'svelte/transition';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Chapter from "./Chapter.svelte";
    
    import type {IManga, IChapter} from '../../../engine/MangaProvider';

    let chapters: Promise<IChapter[]> = Promise.resolve([]);
    let filteredChapters: IChapter[] = [];

    export let selectedManga: IManga| null;
    let selectedChapter: IChapter| null;


    //On: MangaChange
    $: {
        chapters = selectedManga?.GetChapters() ?? Promise.resolve([]);
        selectedChapter = null;
    } 

    let chapterNameFilter = '';
    $:{
        chapters.then((value) => filteredChapters=value.filter(item => {
            return item.Title.toLowerCase().indexOf(chapterNameFilter.toLowerCase()) !== -1;
        }));
    } 

</script>
<style>
    #Chapter {
        display: grid;
        min-height:0;
        height: 100%;
        grid-template-rows: 2em 2em 2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "ChapterTitle"
            "LanguageFilter"
            "ChapterFilter"
            "ChapterList"
            "ChapterCount";
        grid-area: Chapter;
    }
    #LanguageFilter { grid-area: LanguageFilter; display: table; }
    #ChapterFilter {  grid-area: ChapterFilter; display: table; }
    #ChapterList { grid-area: ChapterList; background-color: var(--cds-field-01); overflow-y: scroll; overflow-x:hidden}
    #ChapterCount { grid-area: ChapterCount; margin:0.25em;}
    :global(#ChapterList .list) {
        white-space: nowrap;
        list-style-type: none;
        padding: 0.25em;
    }
    .separator {
        border-bottom: 1px groove var(--cds-button-separator);
    }

    .inline{
        width:fit-content;
    }
    .inline-wide{
        display:table-cell;
        width:100%;
    }
</style>
<div id="Chapter" transition:fade>
    <div id="ChapterTitle">
        <h5 class="separator">Chapter List</h5>
    </div>
    <div id="LanguageFilter">
        <div class="inline">
        <Button 
            icon={EarthFilled16}
            hasIconOnly
            size="small"
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Languages"
        />
        </div>
        <div class="inline-wide">
            <Dropdown
                selectedIndex={0}
                size="sm"
                items={[{ id: '0', text: '*' }, { id: '1', text: 'gb' }, { id: '2', text: 'fr' }]}
                
            />
        </div>
    </div>
    <div id="ChapterFilter">
        <Search size="sm" bind:value={chapterNameFilter}/>
    </div>
    <div id="ChapterList" class="list">
        {#await chapters}
            <InlineLoading status="active" description="Working..." />
        {:then chapters}
            {#each filteredChapters as chapter, i}
                <Chapter chapter={chapter} selected={selectedChapter===chapter} on:view={e => {selectedChapter = e.detail; dispatch('view',selectedChapter);} }/>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
    <div id="ChapterCount">
        {#await chapters}
            Chapters: ?
        {:then chapters}
            Chapters: {filteredChapters.length}/{chapters.length}
        {:catch error}
            Chapters: ?
        {/await}
    </div>
</div>