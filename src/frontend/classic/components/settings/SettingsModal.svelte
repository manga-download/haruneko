<script lang="ts">
    import { Modal, Tabs, Tab, TabContent } from 'carbon-components-svelte';
    import SettingsViewer from './SettingsViewer.svelte';
    import SettingsPanel from './SettingsPanel.svelte';

    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import { Locale } from '../../SettingsStore';
    import { ResourceKey } from '../../../../i18n/ILocale';
    import { Scope } from '../../../../engine/SettingsGlobal';

    async function delay(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    export let isPluginModalOpen = false;
    export let selectedTab = 0;
    export let preselectedPlugin: IMediaContainer;
</script>

<Modal
    id="pluginModal"
    size="lg"
    hasScrollingContent
    bind:open={isPluginModalOpen}
    passiveModal
    modalHeading="Settings"
    on:click:button--secondary={() => (isPluginModalOpen = false)}
    on:open
    on:close
    hasForm
>
    <Tabs type="container" selected={selectedTab}>
        <Tab label="General" />
        <Tab label="Style" />
        <Tab label="Trackers" />
        <Tab label="Network" />
        <Tab
            label={preselectedPlugin
                ? '* ' + preselectedPlugin.Title
                : 'Connectors'}
        />

        <svelte:fragment slot="content">
            <TabContent>
                <SettingsViewer
                    settings={window.HakuNeko.SettingsManager.OpenScope(Scope)}
                />
            </TabContent>
            <TabContent>
                <SettingsPanel />
            </TabContent>
            <TabContent>
                {#each [...window.HakuNeko.PluginController.InfoTrackers].filter((tracker) => [...tracker.Settings].length > 0) as tracker}
                    <h4>{tracker.Title}</h4>
                    <SettingsViewer settings={tracker.Settings} />
                {/each}
            </TabContent>
            <TabContent>Network & Throttling options</TabContent>
            <TabContent>
                {#if preselectedPlugin}
                    <SettingsViewer settings={preselectedPlugin.Settings} />
                {:else}
                    Access each plugin settings from the plugin list menu.
                {/if}
            </TabContent>
        </svelte:fragment>
    </Tabs>
</Modal>

<style>
    :global(#selectedTags) {
        padding: 1rem 1rem 0 0;
    }
    :global(#pluginModal .bx--modal-content) {
        margin-bottom: 0;
    }
</style>
