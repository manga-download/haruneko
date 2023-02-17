<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Misuse,
        RowDelete,
        RowInsert,
        ZoomIn,
        ZoomOut,
    } from 'carbon-icons-svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';

    export let title: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="Buttons">
    <span class="title">{title}</span>
    <span class="button" on:click={() => dispatch('previousItem')}>
        <ChevronLeft size={24} title="Preview item (ArrowLeft)" />
    </span>
    <span class="button" on:click={() => dispatch('nextItem')}>
        <ChevronRight size={24} title="Next item (ArrowRight)" />
    </span>
    &nbsp;
    <span class="button" on:click={ViewerPadding.decrement}>
        <RowDelete
            size={24}
            title="Decrease spacing between images (CTRL ➖)"
        />
    </span>
    <span class="button" on:click={ViewerPadding.increment}>
        <RowInsert
            size={24}
            title="Increase spacing between images (CTRL ➕)"
        />
    </span>
    &nbsp;
    <span class="button" on:click={ViewerZoom.increment}>
        <ZoomIn size={24} title="Zoom In (➕)" />
    </span>
    <span class="button" on:click={ViewerZoom.decrement}>
        <ZoomOut size={24} title="Zoom Out (➖)" />
    </span>
    &nbsp
    <span class="button" on:click={() => dispatch('close')}>
        <Misuse size={24} title="Close (ESC)" />
    </span>
</div>

<style>
    #Buttons {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        right: 0;
        height: 3rem;
        padding-left: 1em;
        padding-right: 2em;
        opacity: 0.05;
        transition: opacity 0.25s;
        background-color: var(--cds-ui-04);
        border-bottom-left-radius: 1em;
        box-shadow: 0em 0em 1em var(--cds-ui-01);
        outline: none; /* disable focus border */
    }
    #Buttons:hover {
        opacity: 1;
        cursor: pointer;
    }
    #Buttons:hover > .title {
        display: inline;
    }

    .title {
        display: none;
        font-weight: bold;
        font-size: 1.25em;
        color: var(--cds-text-01);
    }

    #Buttons .button:hover {
        color: var(--cds-active-ui);
    }
</style>
