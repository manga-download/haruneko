<script lang="ts">
    import { Tile } from 'carbon-components-svelte';
    import { Key,Scope as Global_Scope } from '../../../../engine/SettingsGlobal';
    import SettingsViewer from '../settings/SettingsViewer.svelte';
    import { Locale } from '../../stores/Settings';

   /*
    MediaDirectory = 'media-directory',
    UseWebsiteSubDirectory = 'website-subdirectory',
    MangaExportFormat = 'manga-export-format',*/
    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    oncomplete();

    const MediaDirectorySetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.MediaDirectory);
    const UseWebsiteSubDirectorySetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.UseWebsiteSubDirectory);
    const MangaExportFormatSetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.MangaExportFormat);

</script>
<div>
    <h2>Download Settings</h2>
    <p style="margin-bottom:2em;">{$Locale[MediaDirectorySetting.Description]()}</p>
    <Tile light >
        <SettingsViewer
            settings={[
                MediaDirectorySetting, UseWebsiteSubDirectorySetting, MangaExportFormatSetting
            ]}
        />
    </Tile>
</div>
