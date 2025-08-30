<script lang="ts">
    import { Modal, InlineLoading, Tag } from 'carbon-components-svelte';
    import { type BookmarkImportResult, type BookmarkExportResult } from '.././../../engine/providers/BookmarkPlugin';
    import { Locale, SidenavIconsOnTop } from '../stores/Settings';

    export let isModalOpen = false;
    let importResult: Promise<BookmarkImportResult>;
    let exportResult: Promise<BookmarkExportResult>;

    const importButtonInfo = { text: $Locale.Frontend_Classic_Bookmark_ImportButton() };
    const exportButtonInfo = { text: $Locale.Frontend_Classic_Bookmark_ExportButton() };
    let pressedButton: undefined | { text: string } = undefined;

    function OnSecondaryButtonClick(event: CustomEvent<{ text: string }>) {
        switch (event.detail.text) {
            case $Locale.Frontend_Classic_Bookmark_ImportButton():
                pressedButton = importButtonInfo;
                importResult = window.HakuNeko.BookmarkPlugin.Import();
                return;
            case $Locale.Frontend_Classic_Bookmark_ExportButton():
                pressedButton = exportButtonInfo;
                exportResult = window.HakuNeko.BookmarkPlugin.Export();
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
    modalHeading={$Locale.Frontend_Classic_Bookmark_ModalHeading()}
    preventCloseOnClickOutside
    primaryButtonText={$Locale.Frontend_Classic_Bookmark_CloseButton()}
    secondaryButtons={[importButtonInfo, exportButtonInfo]}
    on:click:button--primary={() => isModalOpen = false}
    on:click:button--secondary={OnSecondaryButtonClick}
>
    {#if !pressedButton}
        <InlineLoading
            status="inactive"
            description={$Locale.Frontend_Classic_Bookmark_ImportDescription()}
        />
    {/if}
    {#if pressedButton === importButtonInfo}
        {#await importResult}
            <InlineLoading
                status="active"
                description={$Locale.Frontend_Classic_Bookmark_Importing()}
            />
        {:then results}
            {#if results.cancelled}
                <InlineLoading status="error" description={$Locale.Frontend_Classic_Bookmark_UserCanceled()} />
            {:else}
                <InlineLoading
                    status="finished"
                    description={$Locale.Frontend_Classic_Bookmark_ImportDone()}
                />
                <div>
                    <Tag type="cyan">
                        ({results.found})
                    </Tag> {$Locale.Frontend_Classic_Bookmark_Found().replace('{0}', String(results.found))}
                </div>
                <div>
                    <Tag type="green">
                        ({results.imported})
                    </Tag> {$Locale.Frontend_Classic_Bookmark_Imported().replace('{0}', String(results.imported))}

                </div>
                <div>
                    <Tag type="cool-gray">
                        ({results.skipped})
                    </Tag> {$Locale.Frontend_Classic_Bookmark_Skipped().replace('{0}', String(results.skipped))}
                </div>
                <div>
                    <Tag type="red">
                        ({results.broken})
                    </Tag> {$Locale.Frontend_Classic_Bookmark_Broken().replace('{0}', String(results.broken))}
                </div>
            {/if}
        {:catch error}
            <InlineLoading status="error" description={$Locale.Frontend_Classic_Bookmark_Error(String(error))} />
        {/await}
    {/if}
    {#if pressedButton === exportButtonInfo}
        {#await exportResult}
            <InlineLoading
                status="active"
                description={$Locale.Frontend_Classic_Bookmark_Exporting()}
            />
        {:then results}
            {#if results.cancelled}
                <InlineLoading status="error" description={$Locale.Frontend_Classic_Bookmark_UserCanceled()} />
            {:else}
                <InlineLoading
                    status="finished"
                    description={$Locale.Frontend_Classic_Bookmark_ExportDone()}
                />
                <div>
                    <Tag type="green">
                        ({results.exported})
                    </Tag> {$Locale.Frontend_Classic_Bookmark_Exported()}
                </div>
            {/if}
        {:catch error}
           <InlineLoading
           status="error"
           description={$Locale.Frontend_Classic_Bookmark_Error(error.message ?? String(error))}
           />
        {/await}
    {/if}
</Modal>

<style>
</style>
