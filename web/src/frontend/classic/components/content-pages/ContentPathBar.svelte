<script>
    import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
    import { contentscreen } from '../../stores/Stores';
</script>

<div id="contentpathbar">
    <Breadcrumb noTrailingSlash>
        <BreadcrumbItem
            href="#"
            isCurrentPage={$contentscreen === '/'}
            on:click={() => ($contentscreen = '/')}
        >
            Hakuneko
        </BreadcrumbItem>
        {#if $contentscreen !== '/'}
            {@const steps = $contentscreen.split('/').slice(1)}
            {#each steps as step, index}
                <BreadcrumbItem
                    href="#"
                    isCurrentPage={index === steps.length - 1}
                    on:click={() =>
                        ($contentscreen = $contentscreen
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

    #contentpathbar :global(nav ol li a) {
        font-weight: bold;
        user-select: none;
    }
    #contentpathbar
        :global(nav ol li a):not(.bx--breadcrumb-item--current):hover {
        cursor: pointer;
    }
</style>
