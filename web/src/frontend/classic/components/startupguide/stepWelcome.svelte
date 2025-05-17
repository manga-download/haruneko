<script lang="ts">
    import Neko from '/src/img/Neko.svg'
    import { Key,Scope as Global_Scope } from '../../../../engine/SettingsGlobal';
    import SettingsViewer from '../settings/SettingsViewer.svelte';
    import { Tile } from 'carbon-components-svelte';


    let {
        oncomplete
    }:{
        oncomplete: () => void
    } = $props();
    oncomplete();

    const languageSetting=window.HakuNeko.SettingsManager.OpenScope(Global_Scope).Get(Key.Language);

</script>
<div id="welcome">
    <SettingsViewer
        settings={[
            languageSetting
        ]}
        inline
        style="margin-bottom:2em"
    />
    <Tile light>
    <div class="presentation">
        <div class="description">
            <p style="margin-top:0.5em;margin-bottom:1em;"><span class="hakuneko">HakuNeko</span> is a cross-platform downloader for manga and anime from various websites.</p>
            <p >It was made to help users who download media for circumstances that requires offline usage.</p>
        </div>
        <img  class="neko" src={Neko} alt="Neko"/>

    </div>    
    <p class="footer">The philosophy is ad-hoc consumption, get it when you want to read/watch it. It is not meant to be a mass downloader to stock up thousands of chapters and will probably never be read.</p>
    </Tile>
</div>

<style>
    #welcome {
        text-align:center;
        padding-top:2em;
    }

    .presentation .description {
        vertical-align: top;
        text-align:left;
        width: 25em;
        left:0;
        display: inline-block;
    }
    img.neko {
        margin-left:1em;
        width: 12em;
    }
    span.hakuneko {
        font-weight: bolder;
    }

    .footer {
        display: inline-block;
        width:32em;
        margin-top:2em;
        font-weight: lighter;
        font-style: italic;
    }
</style>