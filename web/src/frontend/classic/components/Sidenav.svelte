<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
    } from 'carbon-components-svelte';
    import {
        App,
        Bookmark,
        CopyLink,
        Debug,
        Doc,
        Document,
        Events,
        EventsAlt,
        Home,
        Image,
        ImportExport,
        Information,
        Location,
        LogoDiscord,
        LogoGithub,
        NetworkOverlay,
        PlugFilled,
        ScreenMap,
        Settings,
        SettingsAdjust,
        SettingsView,
        TaskSettings,
    } from 'carbon-icons-svelte';
    import { Locale } from '../stores/Settings';
    import SettingsMenu from './settings/SettingsModal.svelte';
    import PluginSelect from './PluginSelect.svelte';
    import BookmarksImport from './BookmarksImport.svelte';

    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
    } from '../stores/Stores';
    import { SidenavTrail, SidenavIconsOnTop } from '../stores/Settings';

    interface Props {
        isOpen: boolean;
        onHome: () => void;
    };
    let { isOpen=$bindable(), onHome }: Props  = $props();

    //Settings Modal
    let settingsSelectedTabs =  $state(0);
    let isSettingsModalOpen =  $state(false);
    let isPluginModalOpen = $state(false);
    let isBookmarksImportModalOpen =  $state(false);
</script>

{#if isPluginModalOpen}
    <PluginSelect
        bind:isPluginModalOpen
        on:close={() => (isPluginModalOpen = false)}
    />
{/if}$
{#if isSettingsModalOpen}
    <SettingsMenu bind:isSettingsModalOpen selectedTab={settingsSelectedTabs} />
{/if}
{#if isBookmarksImportModalOpen}
    <BookmarksImport bind:isModalOpen={isBookmarksImportModalOpen} />
{/if}
<SideNav bind:isOpen rail={$SidenavTrail} expansionBreakpoint={100000}>
    <span class="menuleftpanel">
        <SideNavItems>
            {#if !$SidenavIconsOnTop}
                <SideNavLink
                    text={$Locale.Frontend_Classic_Sidenav_Home()}
                    icon={Home}
                    onclick={onHome}
                />
                <SideNavLink
                    text={'Bookmarks'}
                    icon={Bookmark}
                    onclick={() => {
                        $selectedPlugin = window.HakuNeko.BookmarkPlugin;
                        $selectedMedia = undefined;
                        $selectedItem = undefined;
                    }}
                />
            {/if}
            <SideNavLink
                text={'Paste Media URL'}
                icon={CopyLink}
                onclick={() =>
                    document.dispatchEvent(new Event('media-paste-url'))}
            />
            <SideNavLink
                text={$Locale.Frontend_Plugins()}
                icon={PlugFilled}
                onclick={() => (isPluginModalOpen = true)}
            />
            <SideNavLink
                text="import/export"
                icon={ImportExport}
                onclick={() => (isBookmarksImportModalOpen = true)}
            />
            <SideNavMenu text={$Locale.Frontend_Settings()} icon={Settings}>
                <SideNavLink
                    text={$Locale.Frontend_Classic_Sidenav_Settings_General()}
                    icon={SettingsAdjust}
                    onclick={() => {
                        settingsSelectedTabs = 0;
                        isSettingsModalOpen = true;
                    }}
                />
                <SideNavLink
                    text={$Locale.Frontend_Classic_Sidenav_Settings_Interface()}
                    icon={ScreenMap}
                    onclick={() => {
                        settingsSelectedTabs = 1;
                        isSettingsModalOpen = true;
                    }}
                />
                <SideNavLink
                    text="Viewer"
                    icon={SettingsView}
                    onclick={() => {
                        settingsSelectedTabs = 1;
                        isSettingsModalOpen = true;
                    }}
                />
                <SideNavLink
                    text={$Locale.Frontend_Classic_Sidenav_Settings_Trackers()}
                    icon={TaskSettings}
                    onclick={() => {
                        settingsSelectedTabs = 3;
                        isSettingsModalOpen = true;
                    }}
                />
                <SideNavLink
                    text={$Locale.Frontend_Classic_Sidenav_Settings_Network()}
                    icon={NetworkOverlay}
                    onclick={() => {
                        settingsSelectedTabs = 4;
                        isSettingsModalOpen = true;
                    }}
                />
            </SideNavMenu>
            <SideNavMenu text={$Locale.Frontend_Help()} icon={Document}>
                <SideNavLink
                    text="Documentation"
                    icon={Doc}
                    class="clik-item"
                    onclick={() =>
                        window.open(
                            'https://hakuneko.download/docs/interface/',
                        )}
                />
                <SideNavLink
                    text="Discord"
                    icon={LogoDiscord}
                    class="clik-item"
                    onclick={() =>
                        window.open('https://discordapp.com/invite/A5d3NDf')}
                />
                <SideNavLink
                    text="Open a ticket"
                    icon={Debug}
                    class="clik-item"
                    onclick={() =>
                        window.open(
                            'https://hakuneko.download/docs/troubleshoot/',
                        )}
                />
                <SideNavLink
                    text="Home page"
                    icon={Home}
                    class="clik-item"
                    onclick={() => window.open('https://hakuneko.download')}
                />
                <SideNavLink
                    text="Show IP and localisation"
                    icon={Location}
                    class="clik-item"
                    onclick={() => window.open('https://ipinfo.io/json')}
                />
            </SideNavMenu>
            <SideNavMenu text={$Locale.Frontend_About()} icon={Information}>
                <SideNavLink
                    text="Code source"
                    icon={LogoGithub}
                    class="clik-item"
                    onclick={() =>
                        window.open(
                            'https://hakuneko.download/docs/interface/',
                        )}
                />
                <SideNavLink
                    text="Using version X.X.X"
                    icon={App}
                    class="clik-item"
                    onclick={() => window.open('https://todo.com')}
                />
                <SideNavLink
                    text="Maintainers"
                    icon={Events}
                    class="clik-item"
                    onclick={() =>
                        window.open('https://discordapp.com/invite/A5d3NDf')}
                />
                <SideNavLink
                    text="Contributors"
                    icon={EventsAlt}
                    class="clik-item"
                    onclick={() =>
                        window.open(
                            'https://hakuneko.download/docs/troubleshoot/',
                        )}
                />
                <SideNavLink
                    text="Artwork"
                    icon={Image}
                    class="clik-item"
                    onclick={() =>
                        window.open('https://www.deviantart.com/hakuneko3kune')}
                />
            </SideNavMenu>
        </SideNavItems>
    </span>
</SideNav>

<style>
    .menuleftpanel :global(a.clik-item) {
        cursor: pointer;
    }
</style>
