<script lang="ts">
    import { Tile } from 'carbon-components-svelte';
    import { Scope as UI_Classic_Scope, Scope_Viewer as UI_Classic_Scope_Viewer } from '../../stores/Settings';

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    oncomplete();

    //const mediaDirectorySetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.MediaDirectory);
</script>
<div>
    <h2>Reader Settings</h2>
    <p style="margin-bottom:2em;">Configure the internal viewer</p>
    <Tile light></Tile>
</div>