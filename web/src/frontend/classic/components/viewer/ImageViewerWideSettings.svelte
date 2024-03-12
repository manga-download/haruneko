<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Misuse,
        IntentRequestScaleIn,
        IntentRequestScaleOut,
        CloudServiceManagement,
        ScreenMap,
        ZoomIn,
        ZoomOut,
    } from 'carbon-icons-svelte';
    import {
        ContentSwitcher,
        Switch,
        Button,
        HeaderAction,
        HeaderGlobalAction,
        HeaderPanelDivider,
        Tooltip,
    } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {
        Key,
        Locale,
        ViewerDoublePage,
        ViewerMode,
        ViewerReverseDirection,
    } from '../../stores/Settings';
    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';
    import type {
        MediaContainer,
        MediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    export let item: MediaContainer<MediaItem>;
</script>

<div id="vieweractions">
    <HeaderGlobalAction
        class="previousitem"
        icon={ChevronLeft}
        on:click={() => dispatch('previousItem')}
    />
    <HeaderGlobalAction
        class="nextitem"
        icon={ChevronRight}
        on:click={() => dispatch('nextItem')}
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
                on:click={() => dispatch('previousItem')}
            />
            <Button
                icon={ChevronRight}
                kind="ghost"
                size="small"
                iconDescription="Next item (ArrowRight)"
                on:click={() => dispatch('nextItem')}
            />
            <Button
                icon={ZoomIn}
                kind="ghost"
                size="small"
                iconDescription="Zoom In (➕)"
                on:click={ViewerZoom.increment}
            />
            <Button
                icon={ZoomOut}
                kind="ghost"
                size="small"
                iconDescription="Zoom Out (➖)"
                on:click={ViewerZoom.decrement}
            />
        </div>
        <div>
            <Button
                icon={IntentRequestScaleIn}
                kind="ghost"
                size="small"
                iconDescription="Decrease spacing between images (CTRL ➖)"
                on:click={ViewerPadding.decrement}
            />
            <Button
                icon={IntentRequestScaleOut}
                kind="ghost"
                size="small"
                iconDescription="Increase spacing between images (CTRL ➕)"
                on:click={ViewerPadding.increment}
            />
        </div>
        <HeaderPanelDivider>Reader</HeaderPanelDivider>
        <div class="setting block">
            <Tooltip
                triggerText={$Locale[ViewerMode.setting.Label]()}
                align="start"
                class="tooltip"
            >
                <p>{$Locale[ViewerMode.setting.Description]()}</p>
            </Tooltip>
            <ContentSwitcher size="sm">
                {#each ViewerMode.setting.Options as option}
                    <Switch
                        selected={$ViewerMode === option.key}
                        text={$Locale[option.label]()}
                        on:click={() => ($ViewerMode = option.key)}
                    />
                {/each}
            </ContentSwitcher>
        </div>
        {#if $ViewerMode === Key.ViewerMode_Paginated}
            <div class="setting block">
                <Tooltip
                    triggerText={$Locale[
                        ViewerReverseDirection.setting.Label
                    ]()}
                    align="start"
                    class="tooltip"
                >
                    <p>
                        {$Locale[ViewerReverseDirection.setting.Description]()}
                    </p>
                </Tooltip>
                <ContentSwitcher size="sm">
                    <Switch
                        selected={!$ViewerReverseDirection}
                        on:click={() => ($ViewerReverseDirection = false)}
                    >
                        LeftToRight
                    </Switch>
                    <Switch
                        selected={$ViewerReverseDirection}
                        on:click={() => ($ViewerReverseDirection = true)}
                        >RightToLeft
                    </Switch>
                </ContentSwitcher>
            </div>
            <div class="setting block">
                <Tooltip
                    triggerText={$Locale[ViewerDoublePage.setting.Label]()}
                    align="start"
                    class="tooltip"
                >
                    <p>{$Locale[ViewerDoublePage.setting.Description]()}</p>
                </Tooltip>
                <ContentSwitcher size="sm">
                    <Switch
                        selected={!$ViewerDoublePage}
                        on:click={() => ($ViewerDoublePage = false)}
                    >
                        Single
                    </Switch>
                    <Switch
                        selected={$ViewerDoublePage}
                        on:click={() => ($ViewerDoublePage = true)}
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
        on:click={() => dispatch('close')}
    />
</div>

<style>
    #vieweractions {
        opacity: 5%;
    }
    #vieweractions:hover {
        opacity: 100%;
    }
    #vieweractions :global(.bx--header__action) {
        position: absolute;
        z-index: 9000;
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
