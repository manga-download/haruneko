<script>
    import ImageLoader from './imageLoader.svelte';
    import { ProgressBar, Loading } from 'carbon-components-svelte';

    /**
     * Specify the image source
     */
    export let src = '';

    /**
     * show the current download percentage
     * @type boolean
     */
    export let showPercentage = false;
    /**
     * @type number
     */
    let sizeloaded = 0;

    /**
     * @type number
     */
    let sizetotal = 1;

    /**
     * the current download percentage label text, display only if showPercentage is true
     */
    let percentageLabel = '';

    $: if (showPercentage) {
        percentageLabel =
            ((sizeloaded / sizetotal) * 100).toFixed(0).toString() + '%';
    }

    /**
     * This value detect if we get the image through the connector protocol
     * we will display a, infinite spinner if it's the case because we can't get the download state
     */
    let isConnectorProtocol = src.includes('connector://');
</script>

<ImageLoader {...$$restProps} fadein bind:sizeloaded bind:sizetotal {src}>
    <div slot="loading">
        {#if isConnectorProtocol}
            <Loading withOverlay={false} />
        {:else}
            <ProgressBar
                value={((sizeloaded / sizetotal) * 100).toFixed(0)}
                labelText={percentageLabel}
            />
        {/if}
    </div>

    <div slot="error">An error occurred.</div>
</ImageLoader>
