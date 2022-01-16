<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
    } from "carbon-components-svelte";
    import LogoDiscord16 from "carbon-icons-svelte/lib/LogoDiscord16";
    import Home16 from "carbon-icons-svelte/lib/Home16";
    import LogoGithub16 from "carbon-icons-svelte/lib/LogoGithub16";
    import App16 from "carbon-icons-svelte/lib/App16";
    import Doc16 from "carbon-icons-svelte/lib/Doc16";
    import Events16 from "carbon-icons-svelte/lib/Events16"; // Maintainers
    import EventsAlt16 from "carbon-icons-svelte/lib/EventsAlt16"; // contributors
    import Debug16 from "carbon-icons-svelte/lib/Debug16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import Location16 from "carbon-icons-svelte/lib/Location16";
    import { themes } from "./Theme.svelte";
    import SettingItem from "./SettingItem.svelte";
    import SettingSelect from "./SettingSelect.svelte";
    import SettingInput from "./SettingInput.svelte";
    import SettingToggle from "./SettingToggle.svelte";
    import {
        settings,
        demoTextInput,
        demoNumberInput,
        demoFileInput,
        demoPasswordInput,
        demoToggle,
        website1Username,
        website1Password,
        demoSelect,
        theme,
        showContentPanel,
        viewerMode,
        inversedReading,
        doublePage,
    } from "../utils/storage";
    import { viewerModesSelect } from "../utils/viewerMode";

    export let isSideNavOpen = false;

    function openExternalLink(url: string) {
        // TODO: Frontend must not use framework globals such as `nw` or `chrome`
        // => Such non-browser functionalities needs to be abstracted by the HakuNekp engine ...
        //nw.Shell.openExternal(uri);
        window.open(url);
    }

    const demoSelectItems = [
        { id: "white", label: "White", kind: "dont care" },
        { id: "g10", label: "Gray 10", kind: "dont care" },
        { id: "g80", label: "Gray 80", kind: "dont care" },
        { id: "g90", label: "Gray 90", kind: "dont care" },
        { id: "g100", label: "Gray 100", kind: "dont care" },
    ];
</script>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavMenu text="Input Demo">
            <SettingItem
                labelText="Demo Select"
                helperText="This is an example of helper text"
            >
                <SettingSelect
                    store={demoSelect}
                    storageKey={settings.DEMO_SELECT.KEY}
                    items={demoSelectItems}
                />
            </SettingItem>
            <SettingItem
                labelText="Demo TextInput"
                helperText="This is an example of helper text"
            >
                <SettingInput
                    storageKey={settings.DEMO_TEXT_INPUT.KEY}
                    store={demoTextInput}
                    placeholder="Type something"
                />
            </SettingItem>
            <SettingItem
                labelText="Demo toggle"
                helperText="This is an example of helper text"
            >
                <SettingToggle
                    store={demoToggle}
                    storageKey={settings.DEMO_TOGGLE.KEY}
                />
            </SettingItem>
            <SettingItem
                labelText="Demo Number input"
                helperText="This is an example of helper text"
            >
                <SettingInput
                    store={demoNumberInput}
                    storageKey={settings.DEMO_NUMBER_INPUT.KEY}
                    type="number"
                    min={3}
                    max={5}
                />
            </SettingItem>
            <SettingItem
                labelText="Demo File input"
                helperText="This is an example of helper text"
            >
                <SettingInput
                    store={demoFileInput}
                    storageKey={settings.DEMO_FILE_INPUT.KEY}
                    type="file"
                />
            </SettingItem>
            <SettingItem
                labelText="Demo PasswordInput"
                helperText="This is an example of helper text"
            >
                <SettingInput
                    store={demoPasswordInput}
                    storageKey={settings.DEMO_PASSWORD_INPUT.KEY}
                    type="password"
                />
            </SettingItem>
        </SideNavMenu>
        <SideNavMenu text="General" />
        <SideNavMenu text="Websites">
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website1">
                    <SettingItem
                        labelText="Username"
                        helperText="This is an example of helper text"
                    >
                        <SettingInput
                            store={website1Username}
                            storageKey={settings.WEBSITE_1_USERNAME.KEY}
                            placeholder="Username"
                        />
                    </SettingItem>
                    <SettingItem
                        labelText="Password"
                        helperText="This is an example of helper text"
                    >
                        <SettingInput
                            store={website1Password}
                            storageKey={settings.WEBSITE_1_PASSWORD.KEY}
                            type="password"
                            placeholder="Password"
                        />
                    </SettingItem>
                </SideNavMenu>
            </SettingItem>
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website2" />
            </SettingItem>
            <SettingItem type="sub-menu">
                <SideNavMenu text="Website3" />
            </SettingItem>
        </SideNavMenu>
        <SideNavMenu text="UI">
            <SettingItem
                labelText="Show content panel"
                helperText="Display or not the hakuneko tutorial"
            >
                <SettingToggle
                    store={showContentPanel}
                    storageKey={settings.SHOW_CONTENT_PANEL.KEY}
                />
            </SettingItem>
            <SettingItem
                labelText="Themes"
                helperText="You can select the theme of the hakuneko app"
            >
                <SettingSelect
                    store={theme}
                    storageKey={settings.THEME.KEY}
                    items={themes}
                />
            </SettingItem>
            <SettingItem
                labelText="Viewer mode"
                helperText="You can change the viewer mode (webtoon or manga)"
            >
                <SettingSelect
                    store={viewerMode}
                    storageKey={settings.VIEWER_MODE.KEY}
                    items={viewerModesSelect}
                />
            </SettingItem>
            {#if $viewerMode === "manga"}
                <SettingItem
                    labelText="Inverse reading"
                    helperText="Inverse the reading (like a real manga)"
                >
                    <SettingToggle
                        store={inversedReading}
                        storageKey={settings.INVERSED_READING.KEY}
                    />
                </SettingItem>
                <SettingItem
                    labelText="Double page"
                    helperText="Display two page at a time (like a real manga)"
                >
                    <SettingToggle
                        store={doublePage}
                        storageKey={settings.DOUBLE_PAGE.KEY}
                    />
                </SettingItem>
            {/if}
        </SideNavMenu>
        <SideNavMenu text="Help">
            <SideNavLink
                text="Documentation"
                icon={Doc16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/interface/"
                    )}
            />
            <SideNavLink
                text="Discord"
                icon={LogoDiscord16}
                class="clik-item"
                on:click={() =>
                    openExternalLink("https://discordapp.com/invite/A5d3NDf")}
            />
            <SideNavLink
                text="Open a ticket"
                icon={Debug16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/troubleshoot/"
                    )}
            />
            <SideNavLink
                text="Home page"
                icon={Home16}
                class="clik-item"
                on:click={() => openExternalLink("https://hakuneko.download")}
            />
            <SideNavLink
                text="Show IP and localisation"
                icon={Location16}
                class="clik-item"
                on:click={() => openExternalLink("https://ipinfo.io/jso")}
            />
        </SideNavMenu>
        <SideNavMenu text="About">
            <SideNavLink
                text="Code source"
                icon={LogoGithub16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/interface/"
                    )}
            />
            <SideNavLink
                text="Using version X.X.X"
                icon={App16}
                class="clik-item"
                on:click={() => openExternalLink("https://todo.com")}
            />
            <SideNavLink
                text="Maintainers"
                icon={Events16}
                class="clik-item"
                on:click={() =>
                    openExternalLink("https://discordapp.com/invite/A5d3NDf")}
            />
            <SideNavLink
                text="Contributors"
                icon={EventsAlt16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/troubleshoot/"
                    )}
            />
            <SideNavLink
                text="Artwork"
                icon={Image16}
                class="clik-item"
                on:click={() =>
                    openExternalLink(
                        "https://www.deviantart.com/hakuneko3kune"
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
