<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
    } from 'carbon-components-svelte';
    import {
        App,
        ContentDeliveryNetwork,
        Debug,
        Doc,
        Document,
        Events,
        EventsAlt,
        Home,
        Image,
        Information,
        Location,
        LogoDiscord,
        LogoGithub,
        NetworkOverlay,
        PlugFilled,
        Settings,
        SettingsAdjust,
        SettingsView,
        TaskSettings,
    } from 'carbon-icons-svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import SettingsMenu from './settings/SettingsModal.svelte';
    import PluginSelect from './PluginSelect.svelte';
    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';

    //Todo: why doesn't it work with rail mode on sidenav ?
    export let isSideNavOpen: boolean;
    
    //Settings Modal
    let settingsSelectedTabs = 0;
    let settingsPreselectedPlugin: IMediaContainer;
    let isSettingsModalOpen = false;
    let isPluginModalOpen = false;
</script>

{#if isPluginModalOpen}
    <PluginSelect
        bind:isPluginModalOpen
        on:close={() => (isPluginModalOpen = false)}
        on:settings={(event) => {
            settingsPreselectedPlugin = event.detail;
            settingsSelectedTabs = 4;
            isSettingsModalOpen = true;
        }}
    />
{/if}
<SettingsMenu
    bind:isModalOpen={isSettingsModalOpen}
    selectedTab={settingsSelectedTabs}
    preselectedPlugin={settingsPreselectedPlugin}
/>
<SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
        <SideNavLink
                text="[RES:Home]"
                icon={Home}
                on:click={() => dispatch('home') }
            />
        <SideNavLink
                text="[RES:Plugins]"
                icon={PlugFilled}
                on:click={() => isPluginModalOpen = true }
            />
        <SideNavMenu text="[RES:Settings]" icon={Settings}>
            <SideNavLink
                text="[RES:General]"
                icon={SettingsAdjust}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 0;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:UI]"
                icon={SettingsView}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 1;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:Trackers]"
                icon={TaskSettings}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 2;
                    isSettingsModalOpen = true;
                }}
            />
            <SideNavLink
                text="[RES:Network]"
                icon={NetworkOverlay}
                on:click={() => {
                    settingsPreselectedPlugin = undefined;
                    settingsSelectedTabs = 3;
                    isSettingsModalOpen = true;
                }}
            />
        </SideNavMenu>
        <SideNavMenu text="[RES:Help]"  icon={Document}>
            <SideNavLink
                text="Documentation"
                icon={Doc}
                class="clik-item"
                on:click={() =>
                    window.open(
                        'https://hakuneko.download/docs/interface/'
                    )}
            />
            <SideNavLink
                text="Discord"
                icon={LogoDiscord}
                class="clik-item"
                on:click={() =>
                    window.open('https://discordapp.com/invite/A5d3NDf')}
            />
            <SideNavLink
                text="Open a ticket"
                icon={Debug}
                class="clik-item"
                on:click={() =>
                    window.open(
                        'https://hakuneko.download/docs/troubleshoot/'
                    )}
            />
            <SideNavLink
                text="Home page"
                icon={Home}
                class="clik-item"
                on:click={() => window.open('https://hakuneko.download')}
            />
            <SideNavLink
                text="Show IP and localisation"
                icon={Location}
                class="clik-item"
                on:click={() => window.open('https://ipinfo.io/json')}
            />
        </SideNavMenu>
        <SideNavMenu text="[RES:About]" icon={Information }>
            <SideNavLink
                text="Code source"
                icon={LogoGithub}
                class="clik-item"
                on:click={() =>
                    window.open(
                        'https://hakuneko.download/docs/interface/'
                    )}
            />
            <SideNavLink
                text="Using version X.X.X"
                icon={App}
                class="clik-item"
                on:click={() => window.open('https://todo.com')}
            />
            <SideNavLink
                text="Maintainers"
                icon={Events}
                class="clik-item"
                on:click={() =>
                    window.open('https://discordapp.com/invite/A5d3NDf')}
            />
            <SideNavLink
                text="Contributors"
                icon={EventsAlt}
                class="clik-item"
                on:click={() =>
                    window.open(
                        'https://hakuneko.download/docs/troubleshoot/'
                    )}
            />
            <SideNavLink
                text="Artwork"
                icon={Image}
                class="clik-item"
                on:click={() =>
                    window.open(
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
