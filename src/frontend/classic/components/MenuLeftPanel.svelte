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

    export let isSideNavOpen = false;
    export let onToggle: () => void;
    export let uimode: string;
    export let changeTheme: (themeId: string) => void;

    function openExternalLink(uri: string) {
        nw.Shell.openExternal(uri);
    }

    const win = nw.Window.get();

    $: sideNavStyle = isSideNavOpen ? `min-width: ${win.width / 2}px;` : "";

    const demoSelectItems = [
        { id: "white", label: "White", kind: "dont care" },
        { id: "g10", label: "Gray 10", kind: "dont care" },
        { id: "g80", label: "Gray 80", kind: "dont care" },
        { id: "g90", label: "Gray 90", kind: "dont care" },
        { id: "g100", label: "Gray 100", kind: "dont care" },
    ];

    let currentTheme = "hakuneko";
    // TODO add password field
    // TODO fix the multiple file input issue
</script>

<SideNav bind:isOpen={isSideNavOpen} style={sideNavStyle}>
    <SideNavItems>
        <SideNavMenu text="Input Demo">
            <MenuLeftPanelItem
                labelText="Demo Select"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelSelect
                    selected={demoSelectItems[0].id}
                    items={demoSelectItems}
                    onChange={(newValue) => console.log(newValue)}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo TextInput"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput placeholder="Type something" />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo toggle"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelToggle
                    defaultValue={true}
                    onToggle={() => console.log("toggle change")}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo Number input"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput
                    type="number"
                    min={3}
                    max={5}
                    defaultValue={4}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Demo File input"
                helperText="This is an example of helper text"
            >
                <MenuLeftPanelInput type="file" />
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
                        <MenuLeftPanelInput placeholder="Username" />
                    </MenuLeftPanelItem>
                    <MenuLeftPanelItem
                        labelText="Password"
                        helperText="This is an example of helper text"
                    >
                        <MenuLeftPanelInput placeholder="Password" />
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
                    defaultValue={uimode === "ui-mode-content"}
                    {onToggle}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem
                labelText="Themes"
                helperText="You can select the theme of the hakuneko app"
            >
                <MenuLeftPanelSelect
                    selected={currentTheme}
                    items={themes}
                    onChange={(newValue) =>
                        newValue
                            ? changeTheme(newValue)
                            : console.error(
                                  `can't set theme to value : ${newValue}`
                              )}
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
