<script lang="ts">
    import {
        Modal,
        Tabs,
        Tab,
        TabContent,
        FluidForm,
        NumberInput,
        TextInput,
        Toggle,
        InlineNotification,
    } from 'carbon-components-svelte';
    import SettingsViewer from './SettingsViewer.svelte';
    import SettingsPanel from './SettingsPanel.svelte';

    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import { Locale } from '../../SettingsStore';
    import { ResourceKey } from '../../../../i18n/ILocale';
    import { Scope } from '../../../../engine/SettingsGlobal';

    export let isModalOpen = false;
    export let selectedTab = 0;
    export let preselectedPlugin: IMediaContainer;
</script>

<Modal
    id="settingModal"
    size="lg"
    hasScrollingContent
    bind:open={isModalOpen}
    passiveModal
    modalHeading="Settings"
    on:click:button--secondary={() => (isModalOpen = false)}
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
            <TabContent class="settingtab">
                <SettingsViewer
                    settings={window.HakuNeko.SettingsManager.OpenScope(Scope)}
                />
            </TabContent>
            <TabContent class="settingtab">
                <SettingsPanel />
            </TabContent>
            <TabContent class="settingtab">
                {#each [...window.HakuNeko.PluginController.InfoTrackers].filter((tracker) => [...tracker.Settings].length > 0) as tracker}
                    <h4>{tracker.Title}</h4>
                    <SettingsViewer settings={tracker.Settings} />
                {/each}
            </TabContent>
            <TabContent class="settingtab">
                <div style="padding-bottom:2em;">
                    <Toggle
                        toggled
                        labelText="Download mode"
                        labelA="One by one"
                        labelB="Conccurent"
                    />
                </div>
                <div>
                    <h4>Default global throttling (ms)</h4>
                    <div style="width:15em;float:left;margin-right:2em;">
                        <NumberInput
                            label="per Media List Call"
                            value={50}
                            min={0}
                            max={1000}
                        />
                    </div>
                    <div style="width:15em;float:left;margin-right:2em;">
                        <NumberInput
                            label="per Item List Call"
                            value={20}
                            min={0}
                            max={1000}
                        />
                    </div>
                    <div style="width:15em;float:left;">
                        <NumberInput
                            label="per Item Call"
                            value={20}
                            min={0}
                            max={1000}
                        />
                    </div>
                    <InlineNotification
                        hideCloseButton
                        lowContrast
                        style="margin-top:5em"
                        kind="info"
                        subtitle="per Plugin value in each plugin settings page"
                    />
                </div>
            </TabContent>
            <TabContent style="height:70vh">
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
    :global(#settingModal .settingtab) {
        height: 70vh;
    }
</style>
