<script lang="ts">
    import {
        InlineNotification,
        Modal,
        Tabs,
        Tab,
        TabContent,
    } from 'carbon-components-svelte';
    import SettingsViewer from './SettingsViewer.svelte';
    import ViewerSettings from '../viewer/Settings.svelte';
    import { Scope as UI_Classic_Scope, Scope_Viewer as UI_Classic_Scope_Viewer } from '../../stores/Settings';
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
    hasScrollingContent
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
        <!-- TODO: selectedtab check: temporary cheat until carbon is svelte5 (snippets instead of slots) -->
        <svelte:fragment slot="content">
            <TabContent
                class="settingtab {selectedTab === 0 ? 'activetab' : 'hidden'}"
            >
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(Global_Scope),
                    ]}
                />
            </TabContent>
            <TabContent
                class="settingtab {selectedTab === 1 ? 'activetab' : 'hidden'}"
            >
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(UI_Classic_Scope),
                    ]}
                />
            </TabContent>
            <TabContent
                class="settingtab {selectedTab === 2 ? 'activetab' : 'hidden'}"
            >
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(UI_Classic_Scope_Viewer),
                    ]}
                />
            </TabContent>
            <TabContent
                class="settingtab {selectedTab === 3 ? 'activetab' : 'hidden'}"
            >
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
        </svelte:fragment>
    </Tabs>
</Modal>

<style>
    :global(#settingModal .settingtab) {
        height: 70vh;
    }
    :global(#settingModal .settingtab.hidden) {
        display: none;
    }
</style>
