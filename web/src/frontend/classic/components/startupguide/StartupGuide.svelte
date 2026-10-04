<script lang="ts">
    import {
        Modal,
        ProgressIndicator,
        ProgressStep,
    } from "carbon-components-svelte";

    import StepDownload from "./stepDownload.svelte";
    import StepUI from "./stepUI.svelte";
    import StepViewer from "./stepViewer.svelte";
    import StepTutorial from "./stepTutorial.svelte";
    import StepWelcome from "./stepWelcome.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import { GlobalSettings, Settings } from "../../stores/Settings.svelte";

    const steps = {
        Welcome: 0,
        Download: 1,
        UI: 2,
        Viewer: 3,
        Tutorial: 4,
    };

    let stepsComplete = new SvelteSet<number>([]);
    let currentStep = $state(steps.Welcome);
    let allStepsComplete = $derived(
        Object.values(steps).every((value) => {
            return stepsComplete.has(value);
        })
    );

    async function nextStep() {
        currentStep = (currentStep + 1) % Object.values(steps).length;
    }

    async function close() {
        Settings.StartupGuideEnabled.Value = false;
    }

</script>

<Modal
    id="startupGuide"
    preventCloseOnClickOutside
    modalHeading="Hakuneko"
    hasForm
    primaryButtonText={currentStep === steps.Tutorial && allStepsComplete ? GlobalSettings.Locale.Frontend_Classic_StartupGuide_Button_Close() : GlobalSettings.Locale.Frontend_Classic_StartupGuide_Button_Next()}
    primaryButtonDisabled={!allStepsComplete && currentStep === steps.Tutorial}
    secondaryButtonText={currentStep === steps.Tutorial ? GlobalSettings.Locale.Frontend_Classic_StartupGuide_Button_Restart() : null}
    on:click:button--primary={() => {
        if (currentStep === steps.Tutorial && allStepsComplete) close(); else nextStep();
    }}
    on:click:button--secondary={() => {
        currentStep = steps.Welcome;
    }}
    open
    on:close={close}
>
    <ProgressIndicator bind:currentIndex={currentStep}>
        <ProgressStep
            complete={stepsComplete.has(steps.Welcome)}
            label={GlobalSettings.Locale.Frontend_Classic_StartupGuide_Step_Welcome()}
        />
        <ProgressStep
            complete={stepsComplete.has(steps.Download)}
            label={GlobalSettings.Locale.Frontend_Classic_StartupGuide_Step_Download()}
        />
        <ProgressStep complete={stepsComplete.has(steps.UI)} label={GlobalSettings.Locale.Frontend_Classic_StartupGuide_Step_UI()} />
        <ProgressStep
            complete={stepsComplete.has(steps.Viewer)}
            label={GlobalSettings.Locale.Frontend_Classic_StartupGuide_Step_Viewer()}
        />
        <ProgressStep
            complete={stepsComplete.has(steps.Tutorial)}
            label={GlobalSettings.Locale.Frontend_Classic_StartupGuide_Step_Tutorial()}
        />
    </ProgressIndicator>
    <div id="startupguide">
        {#if currentStep === steps.Welcome}
            <StepWelcome
                oncomplete={() => stepsComplete.add(steps.Welcome)}
            />
        {/if}
        {#if currentStep === steps.Download}
            <StepDownload
                oncomplete={() => stepsComplete.add(steps.Download)}
            />
        {/if}
        {#if currentStep === steps.UI}
            <StepUI oncomplete={() => stepsComplete.add(steps.UI)} />
        {/if}
        {#if currentStep === steps.Viewer}
            <StepViewer
                oncomplete={() => stepsComplete.add(steps.Viewer)}
            />
        {/if}
        {#if currentStep === steps.Tutorial}
            <StepTutorial
                oncomplete={() => stepsComplete.add(steps.Tutorial)}
            />
        {/if}
    </div>
</Modal>

<style>
    #startupguide {
        padding: 1em 2em 0 2em;
        height: 34em;
        overflow-y: auto;
    }
    :global(#bx--modal-body--startupGuide) {
        padding-bottom: 1em;
        margin-bottom: 1em;
    }

    #startupguide :global(.subtitle) {
        margin-bottom:0.5em;
        color:var(--cds-text-02);
        font-weight:lighter;
    }
</style>
