<script lang="ts">
    import {
        Tile,
        ClickableTile,
        Breadcrumb,
        BreadcrumbItem,
    } from 'carbon-components-svelte';
    import {
        documentation,
        type DocCategory,
        type DocSection,
    } from '../../stores/Documentation';
    let selectedDocSection: DocSection;
    let selectedDocCategory: DocCategory;
</script>

{#if selectedDocSection}
    <Breadcrumb noTrailingSlash>
        <BreadcrumbItem
            href="#"
            on:click={() => {
                selectedDocSection = null;
                selectedDocCategory = null;
            }}>Documentation</BreadcrumbItem
        >
        <BreadcrumbItem>{selectedDocCategory?.name}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{selectedDocSection?.name}</BreadcrumbItem
        >
    </Breadcrumb>
    <div class="article">{@html selectedDocSection?.content.outerHTML}</div>
{:else}
    {#each $documentation as docCategory}
        <div class="category">
            <h3 class="name">{docCategory.name}</h3>
            <div class="content">
                {@html docCategory.description.outerHTML}
                <div class="section">
                    {#each docCategory.sections as docSection}
                        <ClickableTile
                            light
                            on:click={() => {
                                selectedDocCategory = docCategory;
                                selectedDocSection = docSection;
                            }}
                        >
                            {docSection.name}
                        </ClickableTile>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
{/if}

<style>
    .category:not(:last-child) {
        margin-bottom: 2em;
    }
    .category .name {
        text-decoration: underline;
    }
    .category .content {
        margin: 1em;
    }
    .section {
        display: flex;
        flex-flow: row wrap;
    }
    .section > :global(*) {
        flex: 0 1 calc(33% - 0.5em);
        min-width: 20em;
        margin: 0.2em;
    }
    .article {
        margin-top: 1em;
    }
    .article :global(p) {
        margin-bottom: 0.5em;
    }
    /* override carbon components */
    .article :global(ol) {
        list-style: auto;
        padding-left: 2em;
    }
    .article :global(li) {
        padding: 0.2em;
    }
    .article :global(.border) {
        padding: 1em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        margin-bottom: 0.5em;
    }
</style>
