<script lang="ts">
    // UI: Svelte
    import {
        Button,
        Tile,
        Modal,
        DataTable,
        OutboundLink,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        Pagination,
    } from 'carbon-components-svelte';
    import {
        Settings,
        Star,
        StarFilled,
        ContentDeliveryNetwork,
    } from 'carbon-icons-svelte';
    // Svelte
    import { fade } from 'svelte/transition';
    // UI: Components
    import Chip from '../lib/Tag.svelte';
    import { type Tag, Tags } from '../../../engine/Tags';
    import type {
        MediaContainer,
        MediaChild,
    } from '../../../engine/providers/MediaPlugin';
    import SettingsViewer from './settings/SettingsViewer.svelte';
    // UI : Stores
    import { Locale } from '../stores/Settings';
    import { selectedPlugin } from '../stores/Stores';
    // Hakuneko Engine
    import { TagCategoryResourceKey as R } from '../../../i18n/ILocale';

    function createDataRow(item: MediaContainer<MediaChild>) {
        return {
            id: item.Identifier,
            name: item.Title,
            website: new URL(item.URI),
            image: item.Icon,
            tags: item.Tags.Value,
            overflow: item,
            favorite: item,
        };
    }

    export let isPluginModalOpen = false;
    let pagination = {
        totalItems: 0,
        page: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20],
    };

    let pluginToConfigure: MediaContainer<MediaChild>;

    const langTags = Tags.Language.toArray();
    const typeTags = Tags.Media.toArray();
    const otherTags = [...Tags.Source.toArray(), ...Tags.Rating.toArray()];

    let pluginNameFilter = '';
    let pluginTagsFilter: Tag[] = [];

    function addTagFilter(tag: Tag) {
        if (!pluginTagsFilter.includes(tag)) {
            pluginTagsFilter = [...pluginTagsFilter, tag];
        }
    }
    function removeTagFilter(tag: Tag) {
        pluginTagsFilter = pluginTagsFilter.filter((value) => tag !== value);
    }

    let filterFavorites = false;
    let filteredPluginlist: ReturnType<typeof createDataRow>[] = [];
    $: {
        filteredPluginlist = HakuNeko.PluginController.WebsitePlugins.filter(
            (plugin) => {
                let rejectconditions: Array<boolean> = [];
                if (
                    pluginNameFilter !== '' &&
                    plugin.Title.toLowerCase().indexOf(
                        pluginNameFilter.toLowerCase(),
                    ) === -1
                )
                    rejectconditions.push(true);
                if (plugin.Tags.Value) {
                    pluginTagsFilter.forEach((tagfilter) => {
                        if (!plugin.Tags.Value.includes(tagfilter))
                            rejectconditions.push(true);
                    });
                }
                return !rejectconditions.length;
            },
        ).map((item) => createDataRow(item));
        pagination.totalItems = filteredPluginlist.length;
    }
</script>

<Modal
    id="pluginModal"
    size="lg"
    hasScrollingContent
    bind:open={isPluginModalOpen}
    passiveModal
    modalHeading="Plugin Selection"
    on:click:button--secondary={() => (isPluginModalOpen = false)}
    on:open
    on:close
    hasForm
>
    <div class="content tags">
        <Tile>
            <div class="lang">
                <strong>{$Locale[Tags.Language.Title]()}</strong>
                {#each langTags as item}
                    <Chip
                        class="cursor-pointer"
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="type">
                <strong>{$Locale[Tags.Media.Title]()}</strong>
                {#each typeTags as item}
                    <Chip
                        class="cursor-pointer"
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="other">
                <strong>{$Locale[R.Tags_Others]()}</strong>
                {#each otherTags as item}
                    <Chip
                        class="cursor-pointer"
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
        </Tile>
    </div>
    <Tile id="selectedTags">
        <span>Tags:</span>
        {#each pluginTagsFilter as item}
            <Chip
                filter
                category={item.Category}
                label={item.Title}
                on:click={() => removeTagFilter(item)}
            />
        {/each}
    </Tile>
    <DataTable
        zebra
        size="short"
        headers={[
            { key: 'favorite', empty: false },
            { key: 'image', empty: true },
            { key: 'name', value: 'Name' },
            { key: 'website', value: 'Website' },
            { key: 'tags', value: 'Tags' },
            { key: 'overflow', empty: true },
        ]}
        bind:pageSize={pagination.pageSize}
        bind:page={pagination.page}
        rows={filteredPluginlist}
        on:click:row={(event) => {
            $selectedPlugin = event.detail.overflow;
            isPluginModalOpen = false;
        }}
    >
        <Toolbar>
            <ToolbarContent>
                <ToolbarSearch
                    persistent
                    expanded
                    bind:value={pluginNameFilter}
                />
            </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="cell-header" let:header>
            {#if header.key === 'favorite'}
                <Button
                    kind="secondary"
                    iconDescription="Filter favorites"
                    icon={filterFavorites ? StarFilled : Star}
                    on:click={(e) => {
                        filterFavorites = !filterFavorites;
                        e.stopPropagation();
                    }}
                />
            {:else}
                {header.value}
            {/if}
        </svelte:fragment>
        <div class="plugin-row" slot="cell" let:cell in:fade>
            {#if cell.key === 'favorite'}
                <Button
                    kind="ghost"
                    iconDescription="Add to favorites"
                    icon={true ? StarFilled : Star}
                    on:click={(e) => {
                        // TODO: trigger plugin favorite
                        e.stopPropagation();
                    }}
                />
            {:else if cell.key === 'website'}
                <OutboundLink href={cell.value}
                    >{cell.value.hostname}
                </OutboundLink>
            {:else if cell.key === 'image'}
                <img src={cell.value} alt="Logo" height="24" />
            {:else if cell.key === 'tags'}
                {#each cell.value as item}
                    <Chip category={item.Category} label={item.Title} />
                {/each}
            {:else if cell.key === 'overflow'}
                <div class=" action-cell">
                    {#if [...cell.value.Settings].length > 0}
                        <Button
                            size="small"
                            kind="secondary"
                            tooltipPosition="left"
                            icon={Settings}
                            iconDescription="Connector's settings"
                            on:click={(e) => {
                                pluginToConfigure = cell.value;
                                e.stopPropagation();
                            }}
                        />
                    {/if}
                    <Button
                        size="small"
                        kind="secondary"
                        tooltipPosition="left"
                        icon={ContentDeliveryNetwork}
                        iconDescription="Open website URL"
                        on:click={(e) => {
                            e.stopPropagation();
                            window.open(cell.value.URI);
                        }}
                    />
                </div>
            {:else}{cell.value}{/if}
        </div>
    </DataTable>
    <Pagination
        bind:pageSize={pagination.pageSize}
        bind:page={pagination.page}
        totalItems={pagination.totalItems}
        pageSizes={pagination.pageSizes}
    />
</Modal>

{#if pluginToConfigure}
    <Modal
        id="pluginSettingsModal"
        size="lg"
        hasScrollingContent
        open
        passiveModal
        modalHeading="Settings"
        on:close={() => (pluginToConfigure = undefined)}
        hasForm
    >
        <SettingsViewer settings={[...pluginToConfigure.Settings]} />
    </Modal>
{/if}

<style>
    :global(#selectedTags) {
        padding: 1rem 1rem 0 0;
    }
    .action-cell {
        text-align: right;
    }
    .plugin-row {
        cursor: pointer;
    }
    :global(#pluginModal .bx--modal-content) {
        margin-bottom: 0;
    }

    .content {
        text-align: center;
        /* overflow-y: scroll; */
        /* overflow-x: hidden; */
    }
    .tags {
        width: 100%;
    }
    .tags :global(.cursor-pointer) {
        cursor: pointer;
    }
    .lang {
        display: inline-block;
        width: 50%;
        vertical-align: top;
    }
    .type {
        display: inline-block;
        width: 20%;
        vertical-align: top;
    }
    .other {
        display: inline-block;
        width: 20%;
        vertical-align: top;
    }
</style>
