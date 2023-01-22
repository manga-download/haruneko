<script>
    import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
    import { Link, useLocation } from 'svelte-navigator';

    const location = useLocation();
    let path;
    $: path = $location.pathname.replace('/index.html');
    let steps;
    $: steps = path.split('/').slice(1);
</script>

<div id="contentpathbar">
    <Breadcrumb noTrailingSlash>
        <BreadcrumbItem isCurrentPage={path === '/'}>
            <Link class="contentpath" to="/">Hakuneko</Link>
        </BreadcrumbItem>
        {#if path !== '/'}
            {#each steps as step, index}
                    <BreadcrumbItem isCurrentPage={index === steps.length - 1}>
                        <Link
                            class="contentpath"
                            to={path
                                .split('/')
                                .slice(0, index + 2)
                                .join('/')}
                        >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                        </Link>
                    </BreadcrumbItem>
            {/each} 
        {/if}
    </Breadcrumb>
</div>
<style>
    #contentpathbar :global(.contentpath) {
        color: var(--cds-text-01);
    }

    #contentpathbar :global(.bx--breadcrumb-item--current .contentpath) {
        text-decoration-line: unset;
    }
</style>
