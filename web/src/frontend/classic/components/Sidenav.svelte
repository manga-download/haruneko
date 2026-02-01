<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
    } from 'carbon-components-svelte';
    import App from 'carbon-icons-svelte/lib/App.svelte';
    import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
    import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
    import Debug from 'carbon-icons-svelte/lib/Debug.svelte';
    import Doc from 'carbon-icons-svelte/lib/Doc.svelte';
    import Document from 'carbon-icons-svelte/lib/Document.svelte';
    import Events from 'carbon-icons-svelte/lib/Events.svelte';
    import EventsAlt from 'carbon-icons-svelte/lib/EventsAlt.svelte';
    import Home from 'carbon-icons-svelte/lib/Home.svelte';
    import Image from 'carbon-icons-svelte/lib/Image.svelte';
    import ImportExport from 'carbon-icons-svelte/lib/ImportExport.svelte';
    import Information from 'carbon-icons-svelte/lib/Information.svelte';
    import Location from 'carbon-icons-svelte/lib/Location.svelte';
    import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
    import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
    import PlugFilled from 'carbon-icons-svelte/lib/PlugFilled.svelte';
    import ScreenMap from 'carbon-icons-svelte/lib/ScreenMap.svelte';
    import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
    import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
    import SettingsView from 'carbon-icons-svelte/lib/SettingsView.svelte';
    import TaskSettings from 'carbon-icons-svelte/lib/TaskSettings.svelte';
    import SettingsMenu from './settings/SettingsModal.svelte';
    import PluginSelect from './PluginSelect.svelte';
    import BookmarksImport from './BookmarksImport.svelte';

    import { Store as UI } from '../stores/Stores.svelte';
    import { GlobalSettings, Settings as UISettings } from '../stores/Settings.svelte';

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
<SideNav bind:isOpen rail={UISettings.SidenavTrail.Value}>
        <SideNavItems>
            {#if !UISettings.SidenavIconsOnTop.Value}
                <SideNavLink
                    text={GlobalSettings.Locale.Frontend_Classic_Sidenav_Home()}
                    icon={Home}
                    onclick={onHome}
                />
                <SideNavLink
                    text={'Bookmarks'}
                    icon={Bookmark}
                    onclick={() => {
                        UI.selectedPlugin = window.HakuNeko.BookmarkPlugin;
                        UI.selectedMedia = undefined;
                        UI.selectedItem = undefined;
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
                text={GlobalSettings.Locale.Frontend_Plugins()}
                icon={PlugFilled}
                onclick={() => (isPluginModalOpen = true)}
            />
            <SideNavLink
                text="import/export"
                icon={ImportExport}
                onclick={() => (isBookmarksImportModalOpen = true)}
            />
            <SideNavMenu text={GlobalSettings.Locale.Frontend_Settings()} icon={Settings}>
                <SideNavLink
                    text={GlobalSettings.Locale.Frontend_Classic_Sidenav_Settings_General()}
                    icon={SettingsAdjust}
                    onclick={() => {
                        settingsSelectedTabs = 0;
                        isSettingsModalOpen = true;
                    }}
                />
                <SideNavLink
                    text={GlobalSettings.Locale.Frontend_Classic_Sidenav_Settings_Interface()}
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
                    text={GlobalSettings.Locale.Frontend_Classic_Sidenav_Settings_Trackers()}
                    icon={TaskSettings}
                    onclick={() => {
                        settingsSelectedTabs = 3;
                        isSettingsModalOpen = true;
                    }}
                />
            </SideNavMenu>
            <SideNavMenu text={GlobalSettings.Locale.Frontend_Help()} icon={Document}>
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
            <SideNavMenu  text={GlobalSettings.Locale.Frontend_About()} icon={Information}>
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
</SideNav>

<style >


    /* Theme Hack: https://github.com/carbon-design-system/carbon-components-svelte/issues/762#issuecomment-885484991 */

    :global(.bx--side-nav) {
        background-color: var(--cds-ui-background);
        color: var(--cds-text-02);
        border-right: 1px solid var(--cds-ui-02);

    }
    :global(.bx--side-nav__divider) {
            background-color: var(--cds-ui-03);
        }
        :global(a.bx--side-nav__link > .bx--side-nav__link-text) {
            color: var(--cds-text-02);
        }
        :global(a.bx--side-nav__link > .bx--side-nav__link-text) {
            color: var(--cds-text-02);
        }
        :global(.bx--side-nav__menu a.bx--side-nav__link--current),
        :global(.bx--side-nav__menu a.bx--side-nav__link[aria-current="page"]),
        :global(a.bx--side-nav__link--current) {
            background-color: var(--cds-hover-ui);
        }
        :global(.bx--side-nav__submenu) {
            color: var(--cds-text-02);
        }
        :global(.bx--side-nav__submenu) {
        color: var(--cds-text-02);
        }
        :global(.bx--side-nav__menu a.bx--side-nav__link--current > span),
        :global(.bx--side-nav__menu a.bx--side-nav__link[aria-current="page"] > span),
        :global(a.bx--side-nav__link--current > span) {
            color: var(--cds-text-01);
        }

        :global(.bx--side-nav__icon > svg) {
            fill: var(--cds-text-02);
        }

        :global(a.bx--side-nav__link[aria-current="page"]),
        :global(a.bx--side-nav__link--current) {
            background-color: var(--cds-hover-ui);
        }

        :global(a.bx--side-nav__link[aria-current="page"] .bx--side-nav__link-text),
        :global(a.bx--side-nav__link--current .bx--side-nav__link-text) {
            color: var(--cds-text-01);
        }

        :global(.bx--side-nav__item:not(.bx--side-nav__item--active)
            > .bx--side-nav__link:hover),
        :global(.bx--side-nav__menu
            a.bx--side-nav__link:not(.bx--side-nav__link--current):not([aria-current="page"]):hover) {
            color: var(--cds-text-01);
            background-color: var(--cds-hover-ui);

        }

        :global(.bx--side-nav__item:not(.bx--side-nav__item--active)
            > .bx--side-nav__link:hover
            > span),
        :global(.bx--side-nav__item:not(.bx--side-nav__item--active)
            .bx--side-nav__menu-item
            > .bx--side-nav__link:hover
            > span) {
            color: var(--cds-text-01);
        }

        :global(.bx--side-nav__submenu:hover) {
            color: var(--cds-text-01) !important;
            background-color: var(--cds-hover-ui) !important;
        }
</style>