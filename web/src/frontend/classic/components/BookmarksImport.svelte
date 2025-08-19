<script lang="ts">
    import { Modal, InlineLoading, Tag } from 'carbon-components-svelte';
    import { type BookmarkImportResult, type BookmarkExportResult } from '.././../../engine/providers/BookmarkPlugin';

    export let isModalOpen = false;
    let importResult: Promise<BookmarkImportResult>;
    let exportResult: Promise<BookmarkExportResult>;
    const importButtonInfo = { text: 'Import' };
    const exportButtonInfo = { text: 'Export' };
    let pressedButton: undefined | { text: string } = undefined;

    function OnSecondaryButtonClick(event: CustomEvent<{ text: string }>) {
        switch (event.detail.text) {
            case importButtonInfo.text:
                pressedButton = importButtonInfo;
                importResult = window.HaruNeko.BookmarkPlugin.Import();
                return;
            case exportButtonInfo.text:
                pressedButton = exportButtonInfo;
                exportResult = window.HaruNeko.BookmarkPlugin.Export();
                return;
        }
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
    secondaryButtons={[importButtonInfo, exportButtonInfo]}
    on:click:button--primary={() => isModalOpen = false}
    on:click:button--secondary={OnSecondaryButtonClick}
>
    {#if !pressedButton}
        <InlineLoading
            status="inactive"
            description="Import Hakuneko's bookmarks from previous version"
        />
    {/if}
    {#if pressedButton === importButtonInfo}
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
    {#if pressedButton === exportButtonInfo}
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
