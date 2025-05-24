<script lang="ts">
    import { Tile } from "carbon-components-svelte";
    import { Key, Scope as UI_Classic_Scope} from '../../stores/Settings';
    import SettingsViewer from "../settings/SettingsViewer.svelte";

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    oncomplete();

    const uiClassicTheme=window.HakuNeko.SettingsManager.OpenScope(UI_Classic_Scope).Get(Key.Theme);
</script>
<div>
    <h2>UI Settings</h2>
    <p style="margin-bottom:2em;">Configure the user interface settings for Hakuneko.</p>
    <Tile light >
        <SettingsViewer
            settings={[
                uiClassicTheme
            ]}
        />
    </Tile>
</div>