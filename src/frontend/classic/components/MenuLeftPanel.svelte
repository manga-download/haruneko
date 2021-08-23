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
    import MenuLeftPanelItem from "./MenuLeftPanelItem.svelte";
    import MenuLeftPanelSelect from "./MenuLeftPanelSelect.svelte";
    import MenuLeftPanelInput from "./MenuLeftPanelInput.svelte";
    import MenuLeftPanelToggle from "./MenuLeftPanelToggle.svelte";
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
    } from "../utils/storage";
    export let isSideNavOpen = false;

    function openExternalLink(uri: string) {
        nw.Shell.openExternal(uri);
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
            <MenuLeftPanelItem
                labelText="Demo Select"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelSelect
                    store={demoSelect}
                    storageKey={settings.DEMO_SELECT.KEY}
                    items={demoSelectItems}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo TextInput"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput
                    storageKey={settings.DEMO_TEXT_INPUT.KEY}
                    store={demoTextInput}
                    placeholder="Type something"
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo toggle"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelToggle
                    store={demoToggle}
                    storageKey={settings.DEMO_TOGGLE.KEY}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo Number input"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput
                    store={demoNumberInput}
                    storageKey={settings.DEMO_NUMBER_INPUT.KEY}
                    type="number"
                    min={3}
                    max={5}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo File input"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput
                    store={demoFileInput}
                    storageKey={settings.DEMO_FILE_INPUT.KEY}
                    type="file"
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo PasswordInput"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput
                    store={demoPasswordInput}
                    storageKey={settings.DEMO_PASSWORD_INPUT.KEY}
                    type="password"
                />
            </MenuLeftPanelItem>
        </SideNavMenu>
        <SideNavMenu text="General" />
        <SideNavMenu text="Websites">
            <MenuLeftPanelItem type="sub-menu">
                <SideNavMenu text="Website1">
                    <MenuLeftPanelItem
                        labelText="Username"
                        helperText="This is an example of helper text"
                    >
                        <MenuLeftPanelInput
                            store={website1Username}
                            storageKey={settings.WEBSITE_1_USERNAME.KEY}
                            placeholder="Username"
                        />
                    </MenuLeftPanelItem>
                    <MenuLeftPanelItem
                        labelText="Password"
                        helperText="This is an example of helper text"
                    >
                        <MenuLeftPanelInput
                            store={website1Password}
                            storageKey={settings.WEBSITE_1_PASSWORD.KEY}
                            type="password"
                            placeholder="Password"
                        />
                    </MenuLeftPanelItem>
                </SideNavMenu>
            </MenuLeftPanelItem>
            <MenuLeftPanelItem type="sub-menu">
                <SideNavMenu text="Website2" />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem type="sub-menu">
                <SideNavMenu text="Website3" />
            </MenuLeftPanelItem>
        </SideNavMenu>
        <SideNavMenu text="UI">
            <MenuLeftPanelItem
                labelText="Show content panel"
                helperText="Display or not the hakuneko tutorial"
            >
                <MenuLeftPanelToggle
                    store={showContentPanel}
                    storageKey={settings.SHOW_CONTENT_PANEL.KEY}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Themes"
                helperText="You can select the theme of the hakuneko app"
            >
                <MenuLeftPanelSelect
                    store={theme}
                    storageKey={settings.THEME.KEY}
                    items={themes}
                />
            </MenuLeftPanelItem>
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
