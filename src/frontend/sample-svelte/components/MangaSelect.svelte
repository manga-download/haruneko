<script lang="ts">
    import {
        ComboBox,
        Button,
        Search,
        InlineLoading,
    } from "carbon-components-svelte";
    import PlugFilled16 from "carbon-icons-svelte/lib/PlugFilled16";

    import { fly, fade } from "svelte/transition";

    import UIManga from "./Manga.svelte";
    import PluginSelect from "./PluginSelect.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Meh ?
    import VirtualList from "@sveltejs/svelte-virtual-list";

    import {
        IMediaContainer,
        IMediaChild,
    } from "../../../engine/providers/MediaPlugin";
    import { Manga } from "../../../engine/providers/MangaPlugin";
    import type { ComboBoxItem } from "carbon-components-svelte/types/ComboBox/ComboBox";

    let plugins: IMediaContainer[] = HakuNeko.PluginController
        .WebsitePlugins as IMediaContainer[];
    let mangas: IMediaChild[] = [];
    let filteredmangas: IMediaChild[] = [];

    let selectedPlugin: IMediaContainer | null;
    let selectedManga: Manga | null;

    let pluginsCombo: Array<ComboBoxItem>;

    $: pluginsCombo = plugins.map((plugin, key) => {
        return { id: key.toString(), text: plugin.Title };
    });

    let selectedPluginIndex = -1;
    $: selectedPlugin = plugins[selectedPluginIndex];

    //On: PluginChange
    $: {
        mangas = selectedPlugin?.Entries ?? [];
        selectedManga = null;
    }

    let mangaNameFilter = "";
    $: {
        filteredmangas = mangas.filter((item) => {
            return (
                item?.Parent?.Title?.toLowerCase().indexOf(
                    mangaNameFilter.toLowerCase()
                ) !== -1
            );
        });
    }

    let showPluginSelect = false;

    function selectPlugin(event: any) {
        const searchComboItem = pluginsCombo.findIndex(
            (item) => item.text === event.detail.Title
        );
        if (searchComboItem) {
            selectedPluginIndex = searchComboItem;
        }
        showPluginSelect = false;
    }

    function shouldFilterPlugin(item: any, value: string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }
</script>

{#if showPluginSelect}
    <div class="PluginSelect" in:fly={{ y: -200, duration: 1000 }} out:fade>
        <PluginSelect
            pluginlist={plugins}
            on:close={() => (showPluginSelect = false)}
            on:select={selectPlugin}
        />
    </div>
{/if}
<div id="Manga" transition:fade>
    <div id="MangaTitle">
        <h5 class="separator">Manga List</h5>
    </div>
    <div id="Plugin">
        <div class="inline">
            <Button
                icon={PlugFilled16}
                hasIconOnly
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Plugin"
                on:click={() => (showPluginSelect = true)}
            />
        </div>

        <div class="inline-wide">
            <ComboBox
                placeholder="Select a Plugin"
                bind:selectedIndex={selectedPluginIndex}
                size="sm"
                items={pluginsCombo}
                shouldFilterItem={shouldFilterPlugin}
            />
        </div>
    </div>
    <div id="MangaFilter">
        <Search size="sm" bind:value={mangaNameFilter} />
    </div>
    <div id="MangaList" class="list">
        {#await mangas}
            <InlineLoading status="active" description="Working..." />
        {:then mangas}
            <VirtualList class="vlist" items={filteredmangas} let:item>
                <UIManga
                    manga={item}
                    selected={selectedManga === item}
                    on:select={(e) => {
                        selectedManga = e.detail;
                        dispatch("select", e.detail);
                    }}
                />
            </VirtualList>
        {:catch error}
            <p style="color: red">{error}</p>
        {/await}
    </div>
    <div id="MangaCount">
        {#await mangas}
            Mangas : ?
        {:then mangas}
            Mangas : {filteredmangas.length}/{mangas.length}
        {:catch error}
            Mangas : ?
        {/await}
    </div>
</div>

<style>
    #Manga {
        min-height: 0;
        height: 100%;
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
    #Plugin {
        grid-area: Plugin;
        display: table;
    }
    #MangaFilter {
        grid-area: MangaFilter;
        display: table;
    }
    #MangaList {
        grid-area: MangaList;
        background-color: var(--cds-field-01);
        overflow: hidden;
    }
    #MangaCount {
        grid-area: MangaCount;
        display: table;
        margin: 0.25em;
    }
    :global(#MangaList .vlist) {
        white-space: nowrap;
        list-style-type: none;
        padding: 0.25em;
    }
    :global(#Plugin-combo) {
        display: table-cell;
        width: 100%;
    }
    .separator {
        border-bottom: 1px groove var(--cds-button-separator);
    }

    .inline {
        width: fit-content;
    }
    .inline-wide {
        display: table-cell;
        width: 100%;
    }
    .PluginSelect {
        position: absolute;
        background-color: var(--cds-ui-01);
        width: 100%;
        height: 100%;
        z-index: 100;
    }
</style>
