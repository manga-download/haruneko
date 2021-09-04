<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {
        ContextMenu,
        ContextMenuDivider,
        ContextMenuGroup,
        ContextMenuOption,
    } from "carbon-components-svelte";
    const dispatch = createEventDispatcher();

    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    export let item: IMediaContainer;
    export let selected: Boolean;
    export let display = "Row";

    // Context Menu
    let itemdiv: HTMLElement;
    let pos = { x: 0, y: 0 };
    let showMenu = false;

    async function onRightClick(event: any) {
        if (showMenu) {
            showMenu = false;
            await new Promise((res) => setTimeout(res, 100));
        }

        pos = { x: event.clientX, y: event.clientY };
        showMenu = true;
    }

    document.addEventListener(
        "contextmenu",
        function (event: any) {
            if (event.target === itemdiv || itemdiv.contains(event.target))
                return;
            closeMenu();
        },
        true
    );

    function closeMenu() {
        showMenu = false;
    }
</script>

{#if showMenu}
    <ContextMenu open={showMenu} x={pos.x} y={pos.y}>
        <ContextMenuOption indented labelText="Download" shortcutText="⌘D" />
        <ContextMenuOption indented labelText="View" shortcutText="⌘V" />
        <ContextMenuDivider />
        <ContextMenuOption indented labelText="Copy">
            <ContextMenuGroup labelText="Copy options">
                <ContextMenuOption id="url" labelText="URL" shortcutText="⌘C" />
                <ContextMenuOption
                    id="name"
                    labelText="name"
                    shortcutText="⌘N"
                />
            </ContextMenuGroup>
        </ContextMenuOption>
        <ContextMenuDivider />
        <ContextMenuOption indented labelText="Bookmark" shortcutText="⌘B" />
    </ContextMenu>
{/if}

{#if display === "Row"}
    <div
        class="listitem"
        class:selected
        bind:this={itemdiv}
        on:click={(e) => {
            selected = true;
            dispatch("click", e);
        }}
        on:contextmenu|preventDefault={onRightClick}
    >
        <CloudDownload16
            class="download"
            on:click={(e) => dispatch("download", item)}
        />
        <Image16 class="viewer" on:click={(e) => dispatch("view", item)} />
        <Bookmark16
            class="bookmark"
            on:click={(e) => dispatch("bookmark", item)}
        />
        {item.Title}
    </div>
{/if}

<style>
    .listitem {
        cursor: pointer;
        user-select: none;
    }
    .listitem:hover {
        background-color: var(--cds-hover-ui);
    }
    .listitem.selected {
        background-color: var(--cds-active-ui);
    }
</style>
