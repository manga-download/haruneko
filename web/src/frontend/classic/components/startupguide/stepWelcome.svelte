<script lang="ts">
    import { onMount } from 'svelte';

    import { Key,Scope as Global_Scope } from '../../../../engine/SettingsGlobal';
    import SettingsViewer from '../settings/SettingsViewer.svelte';
    import { GlobalSettings } from '../../stores/Settings.svelte';

    import { Tile } from 'carbon-components-svelte';
    import Neko from '/src/img/WelcomeNeko.png';

    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    onMount(() => {
        oncomplete();
    });

    const languageSetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.Language);

</script>
<div id="welcome">
    <SettingsViewer
        settings={[languageSetting]}
    />
    <Tile light>
    <div id="presentation">
        <img class="neko" src={Neko} alt="Neko"/>
        <p style="margin-top:0.5em;margin-bottom:1em;"><span class="hakuneko">HakuNeko</span> {GlobalSettings.Locale.Frontend_Welcome_Intro()}</p>
        <p>{GlobalSettings.Locale.Frontend_Welcome_Description()}</p>
    </div>  
    <p class="footer">{GlobalSettings.Locale.Frontend_Welcome_Footer()}</p>
    </Tile>
</div>

<style>
    #welcome {
        text-align:center;
        padding-top:1em;
    }
    #presentation p {
        margin-top:0.5em;
        margin-bottom:0.5em;
    }
    img.neko {
        float: right;
        max-width: 12em;
    }
    span.hakuneko {
        font-weight: bolder;
    }

    .footer {
        width:32em;
        margin-top:2em;
        font-weight: lighter;
        font-style: italic;
    }
</style>