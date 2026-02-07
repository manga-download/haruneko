<script>
    import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
    import {Store as UI } from '../../stores/Stores.svelte';
</script>

<div id="contentpathbar">
    <Breadcrumb noTrailingSlash>
        <BreadcrumbItem
            href="#"
            class="segment"
            isCurrentPage={UI.contentscreen === '/'}
            on:click={() => (UI.contentscreen = '/')}
        >
            Hakuneko
        </BreadcrumbItem>
        {#if UI.contentscreen !== '/'}
            {@const steps = UI.contentscreen.split('/').slice(1)}
            {#each steps as step, index}
                <BreadcrumbItem
                    href="#"
                    class="segment"
                    isCurrentPage={index === steps.length - 1}
                    on:click={() =>
                        (UI.contentscreen = UI.contentscreen
                            .split('/')
                            .slice(0, index + 2)
                            .join('/'))}
                >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                </BreadcrumbItem>
            {/each}
        {/if}
    </Breadcrumb>
</div>

<style>
    #contentpathbar {
        transform: translateY(50%);
    }

    #contentpathbar:global(.segment) {
        font-weight: bold;
        user-select: none;
    }

    #contentpathbar:global(.segment:not([isCurrentPage]):hover) {
        cursor: pointer;
    }
</style>