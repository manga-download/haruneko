<script lang="ts">
    import ChevronLeft24 from "carbon-icons-svelte/lib/ChevronLeft24";
    import ChevronRight24 from "carbon-icons-svelte/lib/ChevronRight24";
    import ZoomIn24 from "carbon-icons-svelte/lib/ZoomIn24";
    import ZoomOut24 from "carbon-icons-svelte/lib/ZoomOut24";
    import RowInsert24 from "carbon-icons-svelte/lib/RowExpand24";
    import RowDelete24 from "carbon-icons-svelte/lib/RowCollapse24";
    import Misuse24 from "carbon-icons-svelte/lib/Misuse24";

    export let title: string;
    export let toggleThumbnailViewer: () => void;
    function increaseImagePadding() {}
    function decreaseImagePadding() {}
    function zoomIn() {}
    function zoomOut() {}
</script>

<div id="Buttons" tabindex="0" on-blur="focus()" on-keydown="onKeyDown">
    <span class="title">{title}</span>
    <ChevronLeft24
        label="Item Down (ArrowLeft)"
        on:click={(e) =>
            console.log(`createEventDispatcher("requestItemDown", item)`)}
    />
    <ChevronRight24
        label="Item Up (ArrowRight)"
        on:click={(e) =>
            console.log(`createEventDispatcher("requestItemUp", item)`)}
    />
    &nbsp;
    <RowDelete24
        label="Decrease spacing between images (CTRL ➖)"
        on:click={decreaseImagePadding}
    />
    <RowInsert24
        label="Increase spacing between images (CTRL ➕)"
        on:click={increaseImagePadding}
    />
    &nbsp;
    <ZoomIn24 label="Zoom In (➕)" on:click={zoomIn} />
    <ZoomOut24 label="Zoom Out (➖)" on:click={zoomOut} />
    &nbsp
    <Misuse24 label="Close (ESC)" on:click={toggleThumbnailViewer} />
</div>
