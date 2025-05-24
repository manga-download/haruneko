<script lang="ts">
    import {
      Modal,
      ProgressIndicator,
      ProgressStep,
    } from 'carbon-components-svelte';

    import StepDownload from './stepDownload.svelte';
    import StepUI from './stepUI.svelte';
    import StepReader from './stepReader.svelte';
    import StepTutorial from './stepTutorial.svelte';
    import StepWelcome from './stepWelcome.svelte';
    import { SvelteMap } from 'svelte/reactivity';

    const Steps = {
      Welcome : 0,
      Download: 1,
      UI : 2,
      Reader : 3,
      Tutorial : 4,
    };

    let stepsComplete = new SvelteMap<number,boolean>([
      [Steps.Welcome, true],
      [Steps.Download, false],
      [Steps.UI, false],
      [Steps.Reader, false],
      [Steps.Tutorial, false],
    ]);
 
    let currentIndex=$state(Steps.Welcome);
    let allStepsComplete = $state(false);

    async function nextStep() {
      currentIndex=(currentIndex +1) % 5;
    }
    async function completeStep(step: number) {
      stepsComplete.set(step, true);
      allStepsComplete = stepsComplete.values().every((value) => {
        return value === true;
      })
    }
    async function complete() {
      open=false;
    }

    let open = $state(true);
    let secondaryButtonText=$derived((allStepsComplete && currentIndex === Steps.Tutorial) ? null : 'Next');
</script>
<Modal
    id="startupGuide"
    preventCloseOnClickOutside
    modalHeading="Hakuneko"
    hasForm
    primaryButtonDisabled={!allStepsComplete}
    primaryButtonText="Complete"
    {secondaryButtonText}
    on:click:button--primary={complete}
    on:click:button--secondary={nextStep}
    bind:open
>

<ProgressIndicator bind:currentIndex >
    <ProgressStep
      complete={stepsComplete.get(Steps.Welcome)}
      label="Welcome"
      description="The progress indicator will listen for clicks on the steps"
    />
    <ProgressStep
      complete={stepsComplete.get(Steps.Download)}
      label="Downloads"
      description="The progress indicator will listen for clicks on the steps"
    />
    <ProgressStep
      complete={stepsComplete.get(Steps.UI)}
      label="UI"
      description="The progress indicator will listen for clicks on the steps"
    />
    <ProgressStep
      complete={stepsComplete.get(Steps.Reader)}
      label="Reader"
      description="The progress indicator will listen for clicks on the steps"
    />
    <ProgressStep
      complete={stepsComplete.get(Steps.Tutorial)}
      label="Tutorial"
      description="The progress indicator will listen for clicks on the steps"
    />

  </ProgressIndicator>
  <div id="startupguide">
    {#if currentIndex === Steps.Welcome}
      <StepWelcome oncomplete={() => completeStep(Steps.Welcome)}/>
    {/if}
    {#if currentIndex === Steps.Download}
      <StepDownload oncomplete={() => completeStep(Steps.Download)}/>
    {/if}
    {#if currentIndex === Steps.UI}
      <StepUI oncomplete={() => completeStep(Steps.UI)}/>
    {/if}
    {#if currentIndex === Steps.Reader}
      <StepReader oncomplete={() => completeStep(Steps.Reader)}/>
    {/if}
    {#if currentIndex === Steps.Tutorial}
      <StepTutorial oncomplete={() => completeStep(Steps.Tutorial)}/>
    {/if}
  </div>
</Modal>

<style>
  #startupguide {
    padding: 2em 2em 0 2em;
    height: 32em;
  }

</style>
