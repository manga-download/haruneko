<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        SkipToContent,
        Toggle,
        TextInput,
    } from "carbon-components-svelte";
    import MinimizeIcon from "carbon-icons-svelte/lib/Subtract24";
    import MaximizeIcon from "carbon-icons-svelte/lib/Checkbox16";
    import RestoreIcon from "carbon-icons-svelte/lib/Copy16";
    import CloseIcon from "carbon-icons-svelte/lib/Close24";
    import { themes } from "./Theme.svelte";
    import MenuLeftPanel from "./MenuLeftPanel.svelte";

    export let isSideNavOpen: boolean;
    export let winMaximized: boolean;
    export let isOpen: boolean;
    export let uimode: string;
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
        <HeaderAction bind:isOpen>
            <HeaderPanelLinks>
                <HeaderPanelDivider>Interface</HeaderPanelDivider>
                <HeaderPanelLink>
                    <Toggle
                        size="sm"
                        labelText="Show content pannel :"
                        labelA="Download Only"
                        labelB="Content"
                        toggled={uimode === "ui-mode-content"}
                        on:toggle={changeUIMode}
                    />
                </HeaderPanelLink>
                <HeaderPanelDivider>Interface</HeaderPanelDivider>
                <HeaderPanelLink>
                    <TextInput
                        inline
                        labelText="User name"
                        placeholder="Enter user name..."
                    />
                </HeaderPanelLink>
                <HeaderPanelDivider>Themes</HeaderPanelDivider>
                {#each themes as item}
                    <HeaderPanelLink on:click={() => changeTheme(item.id)}
                        >{item.label}</HeaderPanelLink
                    >
                {/each}
            </HeaderPanelLinks>
        </HeaderAction>
    </HeaderUtilities>
</Header>

<MenuLeftPanel {isSideNavOpen} onToggle={changeUIMode} {uimode} {changeTheme} />
