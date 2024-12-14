<script lang="ts">
    import { Modal, InlineLoading, Tag } from 'carbon-components-svelte';
    import { type BookmarkImportResult, type BookmarkExportResult } from '.././../../engine/providers/BookmarkPlugin';

    export let isModalOpen = false;
    let importResult: Promise<BookmarkImportResult>;
    let exportResult: Promise<BookmarkExportResult>;
    let action: undefined | 'import' | 'export';

    async function importBookmarks() {
        action = 'import';
        importResult = window.HakuNeko.BookmarkPlugin.Import();
    }
    async function exportBookmarks() {
        action = 'export';
        exportResult = window.HakuNeko.BookmarkPlugin.Export();
    }
</script>

<Modal
    id="trackerModal"
    size="xs"
    bind:open={isModalOpen}
    on:open
    on:close
    on:submit
    modalHeading="Import/Export bookmarks"
    preventCloseOnClickOutside
    primaryButtonText="Close"
    secondaryButtons={[{ text: 'Import' }, { text: 'Export' }]}
    on:click:button--primary={(e) => {
        isModalOpen = false;
    }}
    on:click:button--secondary={(e) => {
        switch (e.detail.text) {
            case 'Import':
                importBookmarks();
                break;
            case 'Export':
                exportBookmarks();
                break;
        }
    }}
>
    {#if !action}
        <InlineLoading
            status="inactive"
            description="Import Hakuneko's bookmarks from previous version"
        />
    {/if}
    {#if action === 'import'}
        {#await importResult}
            <InlineLoading
                status="active"
                description="Import in progress ..."
            />
        {:then results}
            {#if results.cancelled}
                <InlineLoading status="error" description="User canceled" />
            {:else}
                <InlineLoading
                    status="finished"
                    description="Import completed"
                />
                <div>
                    <Tag type="cyan">
                        ({results.found})
                    </Tag> found
                </div>
                <div>
                    <Tag type="green">
                        ({results.imported})
                    </Tag> imported
                </div>
                <div>
                    <Tag type="cool-gray">
                        ({results.skipped})
                    </Tag> skipped
                </div>
                <div>
                    <Tag type="red">
                        ({results.broken})
                    </Tag> broken
                </div>
            {/if}
        {:catch error}
            <InlineLoading status="error" description="Error: {error}"
            ></InlineLoading>
        {/await}
    {/if}
    {#if action === 'export'}
        {#await exportResult}
            <InlineLoading
                status="active"
                description="Export in progress ..."
            />
        {:then results}
            {#if results.cancelled}
                <InlineLoading status="error" description="User canceled" />
            {:else}
                <InlineLoading
                    status="finished"
                    description="Export completed"
                />
                <div>
                    <Tag type="green">
                        ({results.exported})
                    </Tag> exported
                </div>
            {/if}
        {:catch error}
            <InlineLoading status="error" description="Error: {error}"
            ></InlineLoading>
        {/await}
    {/if}
</Modal>

<style>
</style>
