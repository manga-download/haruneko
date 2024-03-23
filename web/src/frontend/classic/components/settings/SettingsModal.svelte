<script lang="ts">
    import {
        Modal,
        Tabs,
        Tab,
        TabContent,
        NumberInput,
        Toggle,
        InlineNotification,
    } from 'carbon-components-svelte';
    import SettingsViewer from './SettingsViewer.svelte';
    import ViewerSettings from '../viewer/Settings.svelte';

    import { Scope } from '../../../../engine/SettingsGlobal';

    export let isModalOpen = false;
    export let selectedTab = 0;
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
        <Tab label="Interface" />
        <Tab label="Viewer" />
        <Tab label="Trackers" />
        <Tab label="Network" />
        <svelte:fragment slot="content">
            <TabContent class="settingtab">
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(Scope),
                    ]}
                />
            </TabContent>
            <TabContent class="settingtab">
                TODO : UI Scope needs to be defined
                <SettingsViewer
                    settings={[
                        ...window.HakuNeko.SettingsManager.OpenScope(Scope),
                    ]}
                />
            </TabContent>
            <TabContent class="settingtab">
                <ViewerSettings />
            </TabContent>
            <TabContent class="settingtab">
                {#each [...window.HakuNeko.PluginController.InfoTrackers].filter((tracker) => [...tracker.Settings].length > 0) as tracker}
                    <h4>{tracker.Title}</h4>
                    <SettingsViewer settings={[...tracker.Settings]} />
                {/each}
            </TabContent>
            <TabContent class="settingtab">
                <div>Placeholders, they do nothing</div>
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
        </svelte:fragment>
    </Tabs>
</Modal>

<style>
    :global(#settingModal .settingtab) {
        height: 70vh;
    }
</style>
