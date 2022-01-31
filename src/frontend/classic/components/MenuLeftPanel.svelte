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
    import SettingItem from './settings/SettingItem.svelte';
    import SettingsPanel from './settings/SettingsPanel.svelte';
    import SettingsViewer from './settings/SettingsViewer.svelte';
    import { Scope } from '../../../engine/SettingsGlobal';

    export let isSideNavOpen = false;

    function openExternalLink(url: string) {
        // TODO: Frontend must not use framework globals such as `nw` or `chrome`
        // => Such non-browser functionalities needs to be abstracted by the HakuNekp engine ...
        //nw.Shell.openExternal(uri);
        window.open(url);
    }
</script>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavMenu text="[RES:General]">
            <SettingsViewer scope={Scope} />
        </SideNavMenu>
        <SideNavMenu text="[RES:Websites]">
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website1">
                </SideNavMenu>
            </SettingItem>
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website2" />
            </SettingItem>
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website3" />
            </SettingItem>
        </SideNavMenu>
        <SideNavMenu text="[RES:UI]">
            <SettingsPanel />
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
