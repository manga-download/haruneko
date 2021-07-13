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

    export let isSideNavOpen = false;

    function openExternalLink(uri: string) {
        nw.Shell.openExternal(uri);
    }
</script>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavMenu text="General" />
        <SideNavMenu text="UI" />
        <SideNavMenu text="Help">
            <SideNavLink
                text="Documentation"
                icon={Doc16}
                class="external-link"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/interface/"
                    )}
            />
            <SideNavLink
                text="Discord"
                icon={LogoDiscord16}
                class="external-link"
                on:click={() =>
                    openExternalLink("https://discordapp.com/invite/A5d3NDf")}
            />
            <SideNavLink
                text="Open a ticket"
                icon={Debug16}
                class="external-link"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/troubleshoot/"
                    )}
            />
            <SideNavLink
                text="Home page"
                icon={Home16}
                class="external-link"
                on:click={() => openExternalLink("https://hakuneko.download")}
            />
            <SideNavLink
                text="Show IP and localisation"
                icon={Location16}
                class="external-link"
                on:click={() => openExternalLink("https://ipinfo.io/jso")}
            />
        </SideNavMenu>
        <SideNavMenu text="About">
            <SideNavLink
                text="Code source"
                icon={LogoGithub16}
                class="external-link"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/interface/"
                    )}
            />
            <SideNavLink
                text="Using version X.X.X"
                icon={App16}
                class="external-link"
                on:click={() => openExternalLink("https://todo.com")}
            />
            <SideNavLink
                text="Maintainers"
                icon={Events16}
                class="external-link"
                on:click={() =>
                    openExternalLink("https://discordapp.com/invite/A5d3NDf")}
            />
            <SideNavLink
                text="Contributors"
                icon={EventsAlt16}
                class="external-link"
                on:click={() =>
                    openExternalLink(
                        "https://hakuneko.download/docs/troubleshoot/"
                    )}
            />
            <SideNavLink
                text="Artwork"
                icon={Image16}
                class="external-link"
                on:click={() =>
                    openExternalLink(
                        "https://www.deviantart.com/hakuneko3kune"
                    )}
            />
        </SideNavMenu>
    </SideNavItems>
</SideNav>

<style>
    :global(a.external-link) {
        cursor: pointer;
    }
</style>
