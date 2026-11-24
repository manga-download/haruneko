<script lang="ts">
    import { onMount } from "svelte";
    import { Layer, Tile } from "carbon-components-svelte";
    import { Settings, GlobalSettings } from "../../stores/Settings.svelte";
    import SettingsViewer from "../settings/SettingsViewer.svelte";

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    onMount(() => {
        oncomplete();
    });
</script>
<div>
    <h4>{GlobalSettings.Locale.Frontend_Classic_StartupGuide_UI_Title()}</h4>
    <p class="subtitle">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_UI_Description()}</p>
    <Layer>
        <Tile >
        <SettingsViewer
            settings={[
                Settings.Theme.Setting
            ]}
        />
        </Tile>
    </Layer>
</div>

