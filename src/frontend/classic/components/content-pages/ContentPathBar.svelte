<script>
    import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
    import { Link, useLocation } from 'svelte-navigator';

    const location = useLocation();
    let path;
    $: path = $location.pathname;
    let steps;
    $: steps = path.split('/').slice(1);
</script>

<Breadcrumb noTrailingSlash>
    <BreadcrumbItem isCurrentPage={path === '/'}>
        <Link class="contentpathbar" to="/">Hakuneko</Link>
    </BreadcrumbItem>
    {#if path !== '/'}
        {#each steps as step, index}
            {#if index === steps.length - 1}
                <BreadcrumbItem isCurrentPage>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                </BreadcrumbItem>
            {:else}
                <BreadcrumbItem>
                    <Link
                        class="contentpathbar"
                        to={path
                            .split('/')
                            .slice(0, index + 2)
                            .join('/')}
                    >
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                    </Link>
                </BreadcrumbItem>
            {/if}
        {/each}
    {/if}
</Breadcrumb>

<style>
    :global(.contentpathbar) {
        color: unset;
    }
</style>
