<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        SkipToContent,
    } from "carbon-components-svelte";
    import MinimizeIcon from "carbon-icons-svelte/lib/Subtract24";
    import MaximizeIcon from "carbon-icons-svelte/lib/Checkbox16";
    import RestoreIcon from "carbon-icons-svelte/lib/Copy16";
    import CloseIcon from "carbon-icons-svelte/lib/Close24";
    import MenuLeftPanel from "./MenuLeftPanel.svelte";

    export let isSideNavOpen: boolean;
    export let winMaximized: boolean;
    export let isOpen: boolean;
    export let changeUIMode: () => void;
    export let changeTheme: (themeId: string) => void;

    const win = nw.Window.get();
</script>

<Header
    id="Header"
    expandedByDefault={false}
    persistentHamburgerMenu={true}
    company="HakuNeko"
    platformName="Media & Anime - Downloader"
    bind:isSideNavOpen
>
    <div slot="skip-to-content">
        <SkipToContent />
    </div>
    <HeaderUtilities>
        <HeaderGlobalAction
            on:click={() => win.minimize()}
            aria-label="Minimize"
            icon={MinimizeIcon}
        />
        <HeaderGlobalAction
            on:click={() => (winMaximized ? win.restore() : win.maximize())}
            aria-label="Maximize"
            icon={winMaximized ? RestoreIcon : MaximizeIcon}
        />
        <HeaderGlobalAction
            on:click={() => win.close()}
            aria-label="Close"
            icon={CloseIcon}
        />
        <HeaderAction bind:isOpen />
    </HeaderUtilities>
</Header>

<MenuLeftPanel {isSideNavOpen} {changeUIMode} {changeTheme} />
