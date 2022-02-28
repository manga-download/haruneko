<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
    } from 'carbon-components-svelte';
    import LogoDiscord16 from 'carbon-icons-svelte/lib/LogoDiscord16';
    import Home16 from 'carbon-icons-svelte/lib/Home16';
    import LogoGithub16 from 'carbon-icons-svelte/lib/LogoGithub16';
    import App16 from 'carbon-icons-svelte/lib/App16';
    import Doc16 from 'carbon-icons-svelte/lib/Doc16';
    import Events16 from 'carbon-icons-svelte/lib/Events16'; // Maintainers
    import EventsAlt16 from 'carbon-icons-svelte/lib/EventsAlt16'; // contributors
    import Debug16 from 'carbon-icons-svelte/lib/Debug16';
    import Image16 from 'carbon-icons-svelte/lib/Image16';
    import Location16 from 'carbon-icons-svelte/lib/Location16';
    import Settings24 from 'carbon-icons-svelte/lib/Settings24';
    import SettingsAdjust20 from 'carbon-icons-svelte/lib/SettingsAdjust20';
    import TaskSettings20 from 'carbon-icons-svelte/lib/TaskSettings20';
    import SettingsView20 from 'carbon-icons-svelte/lib/SettingsView20';
    import NetworkOverlay24 from 'carbon-icons-svelte/lib/NetworkOverlay24';
    import ContentDeliveryNetwork24 from 'carbon-icons-svelte/lib/ContentDeliveryNetwork24';

    import SettingsMenu from './settings/SettingsModal.svelte';

    export let isSideNavOpen = false;
    //Settings Modal
    let settingsSelectedTabs = 0;
    let settingsPreselectedPlugin;
    let isSettingsModalOpen = false;

    function openExternalLink(url: string) {
        // TODO: Frontend must not use framework globals such as `nw` or `chrome`
        // => Such non-browser functionalities needs to be abstracted by the HakuNekp engine ...
        //nw.Shell.openExternal(uri);
        window.open(url);
    }
</script>

<SettingsMenu
    bind:isModalOpen={isSettingsModalOpen}
    selectedTab={settingsSelectedTabs}
    preselectedPlugin={settingsPreselectedPlugin}
/>
<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavMenu text="[RES:Settings]" icon={Settings24}>
            <SideNavLink
                text="[RES:General]"
                icon={SettingsAdjust20}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 0;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:UI]"
                icon={SettingsView20}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 1;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:Trackers]"
                icon={TaskSettings20}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 2;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:Network]"
                icon={NetworkOverlay24}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 3;
                    isSettingsModalOpen = true;
                }}
            />
        </SideNavMenu>
        <SideNavMenu text="[RES:Websites]" icon={ContentDeliveryNetwork24}>
            <!-- TODO:
            Showing the settings from all websites maybe a bad idea, this is just for prototyping
            A better approach could be a gear icon for each website which open its settings
            -->
            {#each [...window.HakuNeko.PluginController.WebsitePlugins].filter((plugin) => [...plugin.Settings].length > 0) as plugin}
                <SideNavLink
                    text={plugin.Title}
                    on:click={() => {
                        settingsPreselectedPlugin = plugin;
                        settingsSelectedTabs = 4;
                        isSettingsModalOpen = true;
                    }}
                />
                <!--<SettingItem type="sub-menu">
                    <SideNavMenu text={plugin.Title}>
                        <SettingsViewer settings={plugin.Settings} />
                    </SideNavMenu>
                </SettingItem>
                -->
            {/each}
        </SideNavMenu>

        <SideNavMenu text="[RES:Help]">
            <SideNavLink
                text="Documentation"
                icon={Doc16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        'https://hakuneko.download/docs/interface/'
                    )}
            />
            <SideNavLink
                text="Discord"
                icon={LogoDiscord16}
                class="clik-item"
                on:click={() =>
                    openExternalLink('https://discordapp.com/invite/A5d3NDf')}
            />
            <SideNavLink
                text="Open a ticket"
                icon={Debug16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        'https://hakuneko.download/docs/troubleshoot/'
                    )}
            />
            <SideNavLink
                text="Home page"
                icon={Home16}
                class="clik-item"
                on:click={() => openExternalLink('https://hakuneko.download')}
            />
            <SideNavLink
                text="Show IP and localisation"
                icon={Location16}
                class="clik-item"
                on:click={() => openExternalLink('https://ipinfo.io/json')}
            />
        </SideNavMenu>
        <SideNavMenu text="[RES:About]">
            <SideNavLink
                text="Code source"
                icon={LogoGithub16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        'https://hakuneko.download/docs/interface/'
                    )}
            />
            <SideNavLink
                text="Using version X.X.X"
                icon={App16}
                class="clik-item"
                on:click={() => openExternalLink('https://todo.com')}
            />
            <SideNavLink
                text="Maintainers"
                icon={Events16}
                class="clik-item"
                on:click={() =>
                    openExternalLink('https://discordapp.com/invite/A5d3NDf')}
            />
            <SideNavLink
                text="Contributors"
                icon={EventsAlt16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        'https://hakuneko.download/docs/troubleshoot/'
                    )}
            />
            <SideNavLink
                text="Artwork"
                icon={Image16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        'https://www.deviantart.com/hakuneko3kune'
                    )}
            />
        </SideNavMenu>
    </SideNavItems>
</SideNav>

<style>
    :global(a.clik-item) {
        cursor: pointer;
    }
</style>
