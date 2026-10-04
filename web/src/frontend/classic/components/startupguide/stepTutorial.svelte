<script lang="ts">
    import { onMount } from 'svelte';
    import tutorial from "./HakunekoTutorial.avif";
    import { GlobalSettings } from '../../stores/Settings.svelte';

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    onMount(() => {
        oncomplete();
    });
</script>
<div id="tutorial">
    <h4>{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Tutorial_Title()}</h4>
    <p class="subtitle">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Tutorial_Description()}</p>
    <img src={tutorial} alt="tutorial" />
</div>

<style>

    img {
        width: 100%;
        object-fit: contain;
    }
</style>