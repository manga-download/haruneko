<script lang="ts">
    import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
    import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
    import Misuse from 'carbon-icons-svelte/lib/Misuse.svelte';
    import IntentRequestScaleIn from 'carbon-icons-svelte/lib/IntentRequestScaleIn.svelte';
    import IntentRequestScaleOut from 'carbon-icons-svelte/lib/IntentRequestScaleOut.svelte';
    import CloudServiceManagement from 'carbon-icons-svelte/lib/CloudServiceManagement.svelte';
    import ScreenMap from 'carbon-icons-svelte/lib/ScreenMap.svelte';
    import ZoomIn from 'carbon-icons-svelte/lib/ZoomIn.svelte';
    import ZoomOut from 'carbon-icons-svelte/lib/ZoomOut.svelte';
    import {
        ContentSwitcher,
        Switch,
        Button,
        HeaderAction,
        HeaderGlobalAction,
        HeaderPanelDivider,
        Tooltip,
    } from 'carbon-components-svelte';
    import { Key, GlobalSettings, Settings } from '../../stores/Settings.svelte';
    import type {
        MediaContainer,
        MediaItem,
    } from '../../../../engine/providers/MediaPlugin';

    interface Props {
        item: MediaContainer<MediaItem>;
        onNextItem: () => void;
        onPreviousItem: () => void;
        onClose: () => void;
    };
    let { item, onNextItem, onPreviousItem, onClose }: Props  = $props();

</script>

<div id="vieweractions">
    <HeaderGlobalAction
        class="previousitem"
        icon={ChevronLeft}
        iconDescription="Previous Item"
        on:click={onPreviousItem}
    />
    <HeaderGlobalAction
        class="nextitem"
        icon={ChevronRight}
        iconDescription="Next Item"
        on:click={onNextItem}
    />
    <HeaderAction
        icon={CloudServiceManagement}
        closeIcon={ScreenMap}
        class="opensettings"
    >
        <HeaderPanelDivider>{item?.Parent.Title}</HeaderPanelDivider>
        <div>{item?.Title}</div>
        <HeaderPanelDivider>Controls</HeaderPanelDivider>
        <div>
            <Button
                icon={ChevronLeft}
                kind="ghost"
                size="small"
                iconDescription="Previous item (ArrowLeft)"
                on:click={onPreviousItem}
            />
            <Button
                icon={ChevronRight}
                kind="ghost"
                size="small"
                iconDescription="Next item (ArrowRight)"
                on:click={onNextItem}
            />
            <Button
                icon={ZoomIn}
                kind="ghost"
                size="small"
                iconDescription="Zoom In (➕)"
                on:click={() => Settings.ViewerZoom.increment}
            />
            <Button
                icon={ZoomOut}
                kind="ghost"
                size="small"
                iconDescription="Zoom Out (➖)"
                on:click={() => Settings.ViewerZoom.decrement}
            />
        </div>
        <div>
            <Button
                icon={IntentRequestScaleIn}
                kind="ghost"
                size="small"
                iconDescription="Decrease spacing between images (CTRL ➖)"
                on:click={() => Settings.ViewerPadding.decrement}
            />
            <Button
                icon={IntentRequestScaleOut}
                kind="ghost"
                size="small"
                iconDescription="Increase spacing between images (CTRL ➕)"
                on:click={() => Settings.ViewerPadding.increment}
            />
        </div>
        <HeaderPanelDivider>Reader</HeaderPanelDivider>
        <div class="setting block">
            <Tooltip
                triggerText={GlobalSettings.Locale[Settings.ViewerMode.setting.Label]()}
                align="start"
                class="tooltip"
            >
                <p>{GlobalSettings.Locale[Settings.ViewerMode.setting.Description]()}</p>
            </Tooltip>
            <ContentSwitcher size="sm">
                {#each Settings.ViewerMode.setting.Options as option}
                    <Switch
                        selected={Settings.ViewerMode.value === option.key}
                        text={GlobalSettings.Locale[option.label]()}
                        on:click={() => (Settings.ViewerMode.value = option.key)}
                    />
                {/each}
            </ContentSwitcher>
        </div>
        {#if Settings.ViewerMode.value === Key.ViewerMode_Paginated}
            <div class="setting block">
                <Tooltip
                    triggerText={GlobalSettings.Locale[
                        Settings.ViewerReverseDirection.setting.Label
                    ]()}
                    align="start"
                    class="tooltip"
                >
                    <p>
                        {GlobalSettings.Locale[Settings.ViewerReverseDirection.setting.Description]()}
                    </p>
                </Tooltip>
                <ContentSwitcher size="sm">
                    <Switch
                        selected={!Settings.ViewerReverseDirection.value}
                        on:click={() => (Settings.ViewerReverseDirection.value = false)}
                    >
                        LeftToRight
                    </Switch>
                    <Switch
                        selected={Settings.ViewerReverseDirection.value}
                        on:click={() => (Settings.ViewerReverseDirection.value = true)}
                        >RightToLeft
                    </Switch>
                </ContentSwitcher>
            </div>
            <div class="setting block">
                <Tooltip
                    triggerText={GlobalSettings.Locale[Settings.ViewerDoublePage.setting.Label]()}
                    align="start"
                    class="tooltip"
                >
                    <p>{GlobalSettings.Locale[Settings.ViewerDoublePage.setting.Description]()}</p>
                </Tooltip>
                <ContentSwitcher size="sm">
                    <Switch
                        selected={!Settings.ViewerDoublePage.value}
                        on:click={() => (Settings.ViewerDoublePage.value = false)}
                    >
                        Single
                    </Switch>
                    <Switch
                        selected={Settings.ViewerDoublePage.value}
                        on:click={() => (Settings.ViewerDoublePage.value = true)}
                    >
                        Double
                    </Switch>
                </ContentSwitcher>
            </div>
        {/if}
    </HeaderAction>
    <HeaderGlobalAction
        class="close"
        icon={Misuse}
        iconDescription="Close"
        onclick={onClose}
    />
</div>

<style>
    #vieweractions {
        opacity: 5%;
        z-index: 8100;
    }
    #vieweractions:hover {
        opacity: 100%;
    }
    #vieweractions :global(.bx--header__action) {
        position: absolute;
        z-index: 8100;
    }
    #vieweractions :global(.close) {
        top: 0;
        right: 1.5em;
    }
    #vieweractions :global(.opensettings) {
        top: 0;
        right: 5em;
    }
    #vieweractions :global(.nextitem) {
        top: 0;
        right: 8.5em;
    }
    #vieweractions :global(.previousitem) {
        top: 0;
        right: 12em;
    }
    #vieweractions :global(div.bx--header-panel) {
        position: absolute;
        top: 0;
        right: 0;
        padding: 3em 0 0 0;
    }
    #vieweractions :global(div.bx--header-panel > li) {
        margin: 1em 1em 0;
    }
    .setting.block {
        margin-top: 0.4em;
    }
    .setting.block :global(.tooltip) {
        margin-bottom: 0.2em;
    }
</style>
