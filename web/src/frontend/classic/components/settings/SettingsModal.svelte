<script lang="ts">
    import {
        InlineNotification,
        Modal,
        Tabs,
        Tab,
        TabContent,
    } from 'carbon-components-svelte';
    import SettingsViewer from './SettingsViewer.svelte';
    import { frontendClassicSettings, frontendClassicSettingsViewer } from '../../stores/Settings.svelte';
    import { Scope as Global_Scope } from '../../../../engine/SettingsGlobal';

    interface Props {
        isSettingsModalOpen: boolean;
        selectedTab: number;
    };
    let { isSettingsModalOpen = $bindable(false), selectedTab = 0}: Props  = $props();
</script>

<Modal
    id="settingModal"
    size="lg"
    bind:open={isSettingsModalOpen}
    passiveModal
    modalHeading="Settings"
    on:click:button--secondary={() => (isSettingsModalOpen = false)}
    on:open
    on:close
    hasForm
>
    <Tabs type="container" bind:selected={selectedTab}>
        <Tab label="General" />
        <Tab label="Interface" />
        <Tab label="Viewer" />
        <Tab label="Trackers" />
        {#snippet content()}
            <TabContent class="settingtab">
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(Global_Scope),
                    ]}
                />
            </TabContent>
            <TabContent class="settingtab">
                <SettingsViewer
                    settings={[
                        ...frontendClassicSettings,
                    ]}
                />
            </TabContent>
            <TabContent class="settingtab">
                <SettingsViewer
                    settings={[
                        ...frontendClassicSettingsViewer,
                    ]}
                />
            </TabContent>
            <TabContent class="settingtab">
                <InlineNotification
                    kind="warning"
                    title="Not implemented"
                    subtitle="Trackers are currently not used (yet)"
                />
                {#each [...window.HakuNeko.PluginController.InfoTrackers].filter((tracker) => [...tracker.Settings].length > 0) as tracker}
                    <h4>{tracker.Title}</h4>
                    <SettingsViewer settings={[...tracker.Settings]} />
                {/each}
            </TabContent>
        {/snippet}
    </Tabs>
</Modal>

<style>
    :global(#settingModal .settingtab) {
        height: 70vh;
    }
</style>
