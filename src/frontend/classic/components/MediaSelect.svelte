<script lang="ts">
    import {
        ComboBox,
        Button,
        Search,
        InlineLoading,
    } from "carbon-components-svelte";
    import PlugFilled16 from "carbon-icons-svelte/lib/PlugFilled16";

    import { fade } from "svelte/transition";

    import Media from "./Media.svelte";
    import PluginSelect from "./PluginSelect.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Meh ?
    import VirtualList from "@sveltejs/svelte-virtual-list";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    import type { ComboBoxItem } from "carbon-components-svelte/types/ComboBox/ComboBox";

    let plugins: IMediaContainer[] = [];

    window.addEventListener(
        "plugins-loaded",
        function () {
            console.log("All plugins loaded");
            plugins = HakuNeko.PluginController.WebsitePlugins;
        },
        false
    );

    let medias: IMediaContainer[] = [];
    let filteredmedias: IMediaContainer[] = [];

    let selectedPlugin: IMediaContainer | undefined;
    let selectedMedia: IMediaContainer | undefined;
    let update: Promise<void> | undefined;

    let pluginsCombo: Array<ComboBoxItem>;

    $: pluginsCombo = plugins.map((plugin, key) => {
        return { id: key.toString(), text: plugin.Title };
    });

    let selectedPluginIndex = -1;
    $: selectedPlugin = plugins[selectedPluginIndex];

    //On: PluginChange
    $: {
        medias = (selectedPlugin?.Entries as IMediaContainer[]) ?? [];
        selectedMedia = undefined;
        update = selectedPlugin?.Update();
    }

    let mediaNameFilter = "";
    $: {
        filteredmedias = medias.filter((item) => {
            return (
                item?.Parent?.Title?.toLowerCase().indexOf(
                    mediaNameFilter.toLowerCase()
                ) !== -1
            );
        });
    }

    let isPluginModalOpen = false;

    function selectPlugin(event: any) {
        const searchComboItem = pluginsCombo.findIndex(
            (item) => item.text === event.detail.Title
        );
        if (searchComboItem) {
            selectedPluginIndex = searchComboItem;
        }
        isPluginModalOpen = false;
    }

    function shouldFilterPlugin(item: any, value: string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }
</script>

{#if isPluginModalOpen}
    <div>
        <PluginSelect
            {isPluginModalOpen}
            pluginlist={plugins}
            on:close={() => (isPluginModalOpen = false)}
            on:select={selectPlugin}
        />
    </div>
{/if}

<div id="Media" transition:fade>
    <div id="MediaTitle">
        <h5 class="separator">Media List (Manga, Anime etc..)</h5>
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
                on:click={() => (isPluginModalOpen = true)}
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

    <div id="MediaFilter">
        <Search size="sm" bind:value={mediaNameFilter} />
    </div>
    <div id="MediaList" class="list">
        {#await update}
            <InlineLoading status="active" description="Working..." />
        {:then}
            <VirtualList class="vlist" items={filteredmedias} let:item>
                <Media
                    media={item}
                    selected={selectedMedia === item}
                    on:select={(e) => {
                        selectedMedia = e.detail;
                        dispatch("select", e.detail);
                    }}
                />
            </VirtualList>
        {:catch error}
            <p style="color: red">{error}</p>
        {/await}
    </div>
    <div id="MediaCount">
        {#await medias}
            Medias : ?
        {:then medias}
            Medias : {filteredmedias.length}/{medias.length}
        {:catch error}
            Medias : ?
        {/await}
    </div>
</div>

<style>
    #Media {
        min-height: 0;
        height: 100%;
        display: grid;
        grid-template-rows: 2em 2em 2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "MediaTitle"
            "Plugin"
            "MediaFilter"
            "MediaList"
            "MediaCount";
        grid-area: Media;
    }
    #Plugin {
        grid-area: Plugin;
        display: table;
    }
    #MediaFilter {
        grid-area: MediaFilter;
        display: table;
    }
    #MediaList {
        grid-area: MediaList;
        background-color: var(--cds-field-01);
        overflow: hidden;
    }
    #MediaCount {
        grid-area: MediaCount;
        display: table;
        margin: 0.25em;
    }
    :global(#MediaList .vlist) {
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
</style>
