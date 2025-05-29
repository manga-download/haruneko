<script lang="ts">
    import { Tile } from "carbon-components-svelte";

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    oncomplete();
</script>
<div>
    <h2>Tutorial</h2>
    <p style="margin-bottom:2em;">Quick starting guide</p>
    <Tile light >TODO: gif tutorial</Tile >
</div>