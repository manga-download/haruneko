<script lang="ts">
    import { onMount } from 'svelte';
    import { GlobalSettings, Settings } from '../../stores/Settings.svelte';

    import { ContentSwitcher, Switch } from 'carbon-components-svelte';
    import ViewerModeHorizontal from './ViewerModeHorizontal.png';
    import ViewerModeVertical from './ViewerModeVertical.png';

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
    <h4>{GlobalSettings.Locale[Settings.ViewerMode.Setting.Label]()}</h4>
    <p class="subtitle">{GlobalSettings.Locale[Settings.ViewerMode.Setting.Description]()}</p>
    <div id="viewermode">
        <ContentSwitcher>
            <Switch
                selected={Settings.ViewerMode.Value === Settings.ViewerMode.Setting.Options[0].key}
                on:click={() => (Settings.ViewerMode.Value  = Settings.ViewerMode.Setting.Options[0].key)}
                >
                <div class="mode">
                    <img class="mode" src={ViewerModeVertical} alt="Viewer Mode Vertical" />
                    <p class="name">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Vertical_Title()}</p>
                    <p class="description">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Vertical_Description()}</p>
                    <p class="description">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Vertical_SubDescription()}</p>
                </div>
            </Switch>
            <Switch
                selected={Settings.ViewerMode.Value === Settings.ViewerMode.Setting.Options[1].key}
                on:click={() => (Settings.ViewerMode.Value  = Settings.ViewerMode.Setting.Options[1].key)}
                >
                <div class="mode">
                    <img class="mode" src={ViewerModeHorizontal} alt="Viewer Mode Horizontal" />
                    <p class="name ">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Horizontal_Title()}</p>
                    <p class="description">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Horizontal_Description()}</p>
                    <p class="description">{GlobalSettings.Locale.Frontend_Classic_StartupGuide_Viewer_Horizontal_SubDescription()}</p>
                </div>
            </Switch>
        </ContentSwitcher>
    </div>
</div>
<style>
    #viewermode :global(button.bx--content-switcher-btn){
        height:16em;
    }
    #viewermode :global(button.bx--content-switcher-btn span.bx--content-switcher__label){
        width:100%;
        text-align:center;
    }
    #viewermode img.mode {
        width: 14em;
    }
    #viewermode p {
        text-align:center;
    }
    #viewermode p.name {
        font-weight:bolder;
    }
    #viewermode p.name::before,p.name:after {
        content: " -- ";
    }
</style>
