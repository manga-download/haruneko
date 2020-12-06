<script lang="ts">
    import {
        ComboBox,
        Button,
        Search,
        InlineLoading,
    } from "carbon-components-svelte";
    import PlugFilled16 from "carbon-icons-svelte/lib/PlugFilled16";


    import { fly,fade } from 'svelte/transition';

    import Manga from "./Manga.svelte";
    import PluginSelect from "./PluginSelect.svelte";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Meh ?
    import VirtualList from "@sveltejs/svelte-virtual-list";

    import type {IMangaHost,IManga } from '../../../engine/MangaProvider';

    let plugins: IMangaHost[] = window.HakuNeko.PluginController.WebsitePlugins as IMangaHost[];
    let mangas: Promise<IManga[]> = Promise.resolve([]);
    let filteredmangas: IManga[] = [];

    let selectedPlugin: IMangaHost | null;
    let selectedManga: IManga| null;

    let pluginsCombo: Array<any>;
    $: pluginsCombo = Array.from(plugins,(plugin,key) => {return {id: key, text: plugin.Title}});
    let selectedPluginCombo = 1; //fucking combobox not handling object binding
    $: selectedPlugin = plugins[selectedPluginCombo];

    //On: PluginChange
    $: {
        mangas = selectedPlugin?.GetMangas() ?? Promise.resolve([]);
        selectedManga = null;
    }

    let mangaNameFilter = '';
    $:{
        mangas.then((value) => filteredmangas=value.filter(item => {
            return item.Title.toLowerCase().indexOf(mangaNameFilter.toLowerCase()) !== -1;
        }));
    } 

    let showPluginSelect=false;

    function selectPlugin (event:any) {
        const searchComboItem=pluginsCombo.find(item => item.text===event.detail.Title);
        if (searchComboItem) {
            selectedPluginCombo=searchComboItem.id;
        }
        showPluginSelect=false;
    }

    function shouldFilterPlugin(item:any, value:string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }

</script>
<style>
    .Manga {
        min-height: 0;
        height:100%;
        display: grid;
        grid-template-rows: 2em 2em 2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "MangaTitle"
            "Plugin"
            "MangaFilter"
            "MangaList"
            "MangaCount";
        grid-area: Manga;
    }
    .Plugin { grid-area: Plugin; display: table; }
    .MangaFilter { grid-area: MangaFilter; display: table; }
    .MangaList { grid-area: MangaList; height:100%; overflow-y: scroll; overflow-x: hidden }
    .MangaCount{ grid-area: MangaCount; margin:0.25em;}

    :global(#Plugin-combo) { 
        display:table-cell;
        width:100%
    }

    .separator {
        border-bottom: var(--manga-control-separator);
    }

    .inline{
        width:fit-content;
    }
    .inline-wide{
        display:table-cell;
        width:100%;
    }
    .PluginSelect {
        position:absolute;
        background-color: var(--cds-ui-01);
        width:100%;
        height:100%;
        z-index: 100;
    }
</style>

{#if showPluginSelect}
    <div class="PluginSelect" in:fly="{{ y: -200, duration: 1000 }}" out:fade>
        <PluginSelect 
            pluginlist={plugins} 
            on:close={()=>showPluginSelect=false}
            on:select={selectPlugin}
        />
    </div>
{/if}
<div class="Manga" transition:fade>
    <div class="MangaTitle">
        <h5 class="separator">Manga List</h5>
    </div>
    <div class="Plugin">
        <div class="inline">
            <Button 
                icon={PlugFilled16}
                hasIconOnly
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Plugin"
                on:click={()=>showPluginSelect=true}
            />
        </div>
        <div class="inline-wide">
            <ComboBox
                placeholder="Select a Plugin"
                bind:selectedIndex={selectedPluginCombo}
                size="sm"
                items={pluginsCombo}
                shouldFilterItem={shouldFilterPlugin}
            />
        </div>
    </div>
    <div class="MangaFilter">
        <Search size="sm" bind:value={mangaNameFilter} />
    </div>
    <div class="MangaList list">
        {#await mangas}
            <InlineLoading status="active" description="Working..." />
        {:then mangas}
            <VirtualList items={filteredmangas} let:item>
                <Manga manga={item} selected={selectedManga===item} on:select={e => {selectedManga = e.detail; dispatch('select', e.detail);}}/>
            </VirtualList>
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
    <div class="MangaCount">
        {#await mangas}
            Mangas : ?
        {:then mangas}
            Mangas : {filteredmangas.length}/{mangas.length}
        {:catch error}
            Mangas : ?
        {/await}
    </div>
</div>