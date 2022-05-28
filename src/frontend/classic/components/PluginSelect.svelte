<script lang="ts">
    import {
        Button,
        Tile,
        Modal,
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        Pagination,
    } from 'carbon-components-svelte';
    import PlayFilledAlt24 from 'carbon-icons-svelte/lib/PlayFilledAlt.svelte';
    import ArrowUpRight24 from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    import Chip from './Tag.svelte';
    import { Tag, Tags } from '../../../engine/Tags';
    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import { Locale } from '../SettingsStore';
    import { ResourceKey } from '../../../i18n/ILocale';

    function createDataRow(item: IMediaContainer) {
        return {
            id: item.Identifier,
            name: item.Title,
            image: item.Icon,
            mediaContainer: item,
        };
    }
    const dispatch = createEventDispatcher();
    export let isPluginModalOpen = false;
    let pagination = {
        totalItems: 0,
        page: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20],
    };

    //because hardccoding values is da way (Do You Know Da Wae?)
    //will fuse in a single main array with dispatch
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
    addTagFilter(Tags.Language.French);

    let filteredPluginlist = [];
    $: {
        filteredPluginlist = HakuNeko.PluginController.WebsitePlugins
            .filter((item) => {
                let conditions: Array<boolean> = [];
                if (pluginNameFilter !== '') {
                    conditions.push(
                        item.Title.toLowerCase().indexOf(
                            pluginNameFilter.toLowerCase()
                        ) !== -1
                    );
                }
                if (pluginTagsFilter.length > 0) {
                    // Quick test tag filtering using language property
                    // Should be a test if all selected tags are in the tags of plugin
                    conditions.push(
                        true
                        /* TODO: resurect language tags later
                item. !== undefined
                    ? pluginTagsFilter.find(
                        (element) => element.label === item.Language
                    ) !== undefined
                    : true
                */
                    );
                }
                return !conditions.includes(false);
            })
            .map((item) => createDataRow(item));
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
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="other">
                <strong>{$Locale[ResourceKey.Tags_Others]()}</strong>
                {#each otherTags as item}
                    <Chip
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
            { key: 'image', empty: true },
            { key: 'name', value: 'Name' },
            { key: 'tags', value: 'Tags' },
            { key: 'overflow', empty: true },
        ]}
        pageSize={pagination.pageSize}
        page={pagination.page}
        rows={filteredPluginlist}
        on:click:row={(event) =>
            dispatch('select', event.detail.mediaContainer)}
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
        <div class="plugin-row" slot="cell" let:cell in:fade>
            {#if cell.key === 'image'}
                <img src={cell.value} alt="Logo" height="24" />
            {:else if cell.key === 'overflow'}
                <div class=" action-cell">
                    <Button
                        kind="ghost"
                        size="small"
                        tooltipPosition="bottom"
                        tooltipAlignment="center"
                        icon={PlayFilledAlt24}
                        on:click={(e) => {
                            alert('Run test');
                            e.stopPropagation();
                        }}
                    >
                        Run Test
                    </Button>
                    <Button
                        size="small"
                        kind="ghost"
                        icon={ArrowUpRight24}
                        iconDescription="Open link"
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
