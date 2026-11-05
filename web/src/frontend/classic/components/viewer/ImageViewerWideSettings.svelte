<script lang="ts">
    import ArrangeHorizontal from "carbon-icons-svelte/lib/ArrangeHorizontal.svelte";
    import ArrowLeft from "carbon-icons-svelte/lib/ArrowLeft.svelte";
    import ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";
    import CarouselVertical from "carbon-icons-svelte/lib/CarouselVertical.svelte";
    import CarouselHorizontal from "carbon-icons-svelte/lib/CarouselHorizontal.svelte";
    import ChevronLeft from "carbon-icons-svelte/lib/ChevronLeft.svelte";
    import ChevronRight from "carbon-icons-svelte/lib/ChevronRight.svelte";
    import DocumentBlank from "carbon-icons-svelte/lib/DocumentBlank.svelte";
    import Misuse from "carbon-icons-svelte/lib/Misuse.svelte";
    import IntentRequestScaleIn from "carbon-icons-svelte/lib/IntentRequestScaleIn.svelte";
    import IntentRequestScaleOut from "carbon-icons-svelte/lib/IntentRequestScaleOut.svelte";
    import CloudServiceManagement from "carbon-icons-svelte/lib/CloudServiceManagement.svelte";
    import ScreenMap from "carbon-icons-svelte/lib/ScreenMap.svelte";
    import ZoomIn from "carbon-icons-svelte/lib/ZoomIn.svelte";
    import ZoomOut from "carbon-icons-svelte/lib/ZoomOut.svelte";
    import {
        ContentSwitcher,
        Switch,
        Button,
        Tooltip,
        Stack,
        Toggle,
    } from "carbon-components-svelte";
    import {
        Key,
        GlobalSettings,
        Settings,
    } from "../../stores/Settings.svelte";
    import type {
        MediaContainer,
        MediaItem,
    } from "../../../../engine/providers/MediaPlugin";
    interface Props {
        item: MediaContainer<MediaItem>;
        onNextItem: () => void;
        onPreviousItem: () => void;
        onClose: () => void;
    }
    let { item, onNextItem, onPreviousItem, onClose }: Props = $props();
    let settingsOpen = $state(false);
    let hideTooltip = $state(true);
    function onmouseenter() {
        hideTooltip = false;
    }
    function onmouseleave() {
        hideTooltip = true;
    }
</script>

<div id="vieweractions" role="presentation" class:open={settingsOpen} {onmouseenter} {onmouseleave}>
    <div class="quickactions">
        <Button
            icon={ChevronLeft}
            iconDescription="Previous Item"
            kind="ghost"
            size="small"
            onclick={onPreviousItem}
            {hideTooltip}
        />
        <Button
            icon={ChevronRight}
            iconDescription="Next Item"
            kind="ghost"
            size="small"
            onclick={onNextItem}
            {hideTooltip}
        />
        <Button
            icon={ZoomIn}
            iconDescription="Zoom In (➕)"
            kind="ghost"
            size="small"
            onclick={() => Settings.ViewerZoom.Increment()}
            {hideTooltip}
        />
        <Button
            icon={ZoomOut}
            iconDescription="Zoom Out (➖)"
            kind="ghost"
            size="small"
            onclick={() => Settings.ViewerZoom.Decrement()}
            {hideTooltip}
        />
        <Button
            icon={IntentRequestScaleIn}
            kind="ghost"
            size="small"
            iconDescription="Decrease spacing between images (CTRL ➖)"
            onclick={() => Settings.ViewerPadding.Decrement()}
            {hideTooltip}
        />
        <Button
            icon={IntentRequestScaleOut}
            kind="ghost"
            size="small"
            iconDescription="Increase spacing between images (CTRL ➕)"
            onclick={() => Settings.ViewerPadding.Increment()}
            {hideTooltip}
        />
        <Button
            icon={settingsOpen ? ScreenMap : CloudServiceManagement}
            iconDescription="Toggle viewer settings"
            kind="ghost"
            size="small"
            class="opensettings"
            onclick={() => (settingsOpen = !settingsOpen)}
            {hideTooltip}
        />
        <Button
            icon={Misuse}
            iconDescription="Close"
            kind="ghost"
            size="small"
            onclick={onClose}
            {hideTooltip}
        />
    </div>
    <div class="settings-panel">
        <div class="section">
            <span class="mediatitle" title={item?.Parent.Title}>{item?.Parent.Title}</span>
            <hr />
            <span class="mediatitle" title={item?.Title}>{item?.Title}</span>
        </div>

        <div class="section">
            Reader
            <hr />
            <div class="setting block">
                <Tooltip
                    triggerText={GlobalSettings.Locale[
                        Settings.ViewerMode.Setting.Label
                    ]()}
                    portalTooltip
                    class="tooltip"
                >
                        {GlobalSettings.Locale[
                            Settings.ViewerMode.Setting.Description
                        ]()}
                </Tooltip>
                <ContentSwitcher size="sm">
                        <Switch
                            selected={Settings.ViewerMode.Value === Settings.ViewerMode.Setting.Options[0].key}
                            onclick={() =>
                                (Settings.ViewerMode.Value = Settings.ViewerMode.Setting.Options[0].key)}
                        >
                            <Stack orientation="horizontal" gap={3}><CarouselVertical />{GlobalSettings.Locale[Settings.ViewerMode.Setting.Options[0].label]()}</Stack>
                        </Switch>
                        <Switch
                            selected={Settings.ViewerMode.Value === Settings.ViewerMode.Setting.Options[1].key}
                            onclick={() =>
                                (Settings.ViewerMode.Value = Settings.ViewerMode.Setting.Options[1].key)}
                        >
                            <Stack orientation="horizontal" gap={3}><CarouselHorizontal />{GlobalSettings.Locale[Settings.ViewerMode.Setting.Options[1].label]()}</Stack>
                        </Switch>
                </ContentSwitcher>
            </div>
            {#if Settings.ViewerMode.Value === Key.ViewerMode_Paginated}
                <div class="setting block">
                    <Tooltip
                        triggerText={GlobalSettings.Locale[
                            Settings.ViewerReverseDirection.Setting.Label
                        ]()}
                        portalTooltip
                        class="tooltip"
                    >
                            {GlobalSettings.Locale[
                                Settings.ViewerReverseDirection.Setting.Description
                            ]()}
                    </Tooltip>
                    <ContentSwitcher size="sm">
                        <Switch
                            selected={!Settings.ViewerReverseDirection.Value}
                            onclick={() =>
                                (Settings.ViewerReverseDirection.Value = false)}
                            > 
                            <Stack orientation="horizontal" gap={3}><ArrowRight /> Left to Right</Stack>
                        </Switch>
                        <Switch
                            selected={Settings.ViewerReverseDirection.Value}
                            onclick={() =>
                                (Settings.ViewerReverseDirection.Value = true)}
                            >
                            <Stack orientation="horizontal" gap={3}><ArrowLeft /> Right to Left</Stack>
                        </Switch>
                    </ContentSwitcher>
                </div>
                <div class="setting block">
                    <Tooltip
                        triggerText={GlobalSettings.Locale[
                            Settings.ViewerDoublePage.Setting.Label
                        ]()}
                        portalTooltip
                        class="tooltip"
                    >
                            {GlobalSettings.Locale[
                                Settings.ViewerDoublePage.Setting.Description
                            ]()}
                    </Tooltip>
                    <ContentSwitcher size="sm">
                        <Switch
                            selected={!Settings.ViewerDoublePage.Value}
                            onclick={() =>
                                (Settings.ViewerDoublePage.Value = false)}
                        >
                            <Stack orientation="horizontal" gap={3}><DocumentBlank />Single</Stack>
                        </Switch>
                        <Switch
                            selected={Settings.ViewerDoublePage.Value}
                            onclick={() =>
                                (Settings.ViewerDoublePage.Value = true)}
                        >
                            <Stack orientation="horizontal" gap={3}><ArrangeHorizontal />Double</Stack>
                        </Switch>
                    </ContentSwitcher>
                </div>
            {/if}
            <Toggle class="setting block" bind:toggled={Settings.ViewerPreloadNextItem.Value} >
                <svelte:fragment slot="labelChildren">
                    <Tooltip
                        triggerText={GlobalSettings.Locale[Settings.ViewerPreloadNextItem.Setting.Label]()}
                        portalTooltip
                        class="tooltip"
                    >
                            {GlobalSettings.Locale[
                                Settings.ViewerPreloadNextItem.Setting.Description
                            ]()}
                    </Tooltip>
                </svelte:fragment>
            </Toggle>
        </div>
    </div>
</div>

<style>
    #vieweractions {
        position: fixed;
        top: 0;
        right: 0;
        opacity: 5%;
        padding: 0 1.5em 0 1.5em;
        background-color: var(--cds-background-active);
        transition: opacity 0.5s ease;
    }
    #vieweractions:hover,#vieweractions.open  {
        opacity: 100%;
    }

    #vieweractions .settings-panel {
        display: none;
    }
    #vieweractions.open .settings-panel {
        height:100vh;
        display:block;
    }
    #vieweractions .quickactions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.25rem;
    }
    #vieweractions .section {
        margin-bottom:2em;
    }
    #vieweractions .mediatitle {
        display: block;
        max-width: 25em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #vieweractions .setting.block {
        margin-bottom: 1em;
    }
    #vieweractions :global(.tooltip) {
        margin-bottom:0.25em;
    }
</style>
