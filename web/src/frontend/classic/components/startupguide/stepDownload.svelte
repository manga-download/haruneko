<script lang="ts">
    import { Tile } from 'carbon-components-svelte';
    import { Key,Scope as Global_Scope } from '../../../../engine/SettingsGlobal';
    import SettingsViewer from '../settings/SettingsViewer.svelte';
    import InputDirectory from '../settings/InputDirectory.svelte';
    import { Check, Choice, Directory } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    const GlobalScope = window.HakuNeko.SettingsManager.OpenScope(Global_Scope);
    // Handpicked
    const MediaDirectorySetting:Directory=GlobalScope.Get(Key.MediaDirectory);
    const UseWebsiteSubDirectorySetting:Check=GlobalScope.Get(Key.UseWebsiteSubDirectory);
    const MangaExportFormatSetting:Choice=GlobalScope.Get(Key.MangaExportFormat);

    $effect(() => {
        if (MediaDirectorySetting?.Value) oncomplete();
    });
</script>
<div>
    <h4>{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Download_Title()}</h4>
    <p class="subtitle">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Download_Description()}</p>
    <Tile light >
        <InputDirectory setting={MediaDirectorySetting}  />
        <SettingsViewer
            settings={[
                UseWebsiteSubDirectorySetting, MangaExportFormatSetting
            ]}
        />
    </Tile>
</div>
