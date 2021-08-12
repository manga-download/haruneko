<script lang="ts">
    import {
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavLink,
        SideNavMenuItem,
        Checkbox,
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
    import MenuLeftPanelTextInput from "./MenuLeftPanelTextInput.svelte";
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
        { value: "white", text: "White" },
        { value: "g10", text: "Gray 10" },
        { value: "g80", text: "Gray 80" },
        { value: "g90", text: "Gray 90" },
        { value: "g100", text: "Gray 100" },
    ];

    // TODO
    // FileSystemItem
    // NumberItem
</script>

<SideNav bind:isOpen={isSideNavOpen} style={sideNavStyle}>
    <SideNavItems>
        <SideNavMenu text="General">
            <MenuLeftPanelItem>
                <MenuLeftPanelSelect
                    labelText="Demo Select"
                    selected={demoSelectItems[0].value}
                    items={demoSelectItems}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem>
                <MenuLeftPanelSelect
                    labelText="Demo Select"
                    helperText="This is an example of helper text"
                    selected={demoSelectItems[0].value}
                    items={demoSelectItems}
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem>
                <MenuLeftPanelTextInput
                    labelText="Demo TextInput"
                    placeholder="Type something"
                    helperText="This is an example of helper text"
                />
            </MenuLeftPanelItem>
            <MenuLeftPanelItem>
                <MenuLeftPanelToggle
                    labelText="Demo toggle"
                    defaultValue={true}
                />
            </MenuLeftPanelItem>
        </SideNavMenu>
        <SideNavMenu text="UI">
            <SideNavMenuItem>
                <Checkbox
                    labelText="Show content panel"
                    checked={uimode === "ui-mode-content"}
                    on:check={onToggle}
                />
            </SideNavMenuItem>
            <SideNavMenu text="Themes">
                {#each themes as item}
                    <SideNavMenuItem
                        class="clik-item"
                        on:click={() => changeTheme(item.id)}
                        >{item.label}</SideNavMenuItem
                    >
                {/each}
            </SideNavMenu>
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
