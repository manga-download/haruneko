<script lang="ts">
    // TODO: text-overflow not working
    import { Button, ProgressBar, TooltipIcon } from 'carbon-components-svelte';
    import { TrashCan, WarningHexFilled } from 'carbon-icons-svelte';

    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type { DownloadTask } from '../../../engine/DownloadTask';
    import { Status } from '../../../engine/DownloadTask';

    export let job: DownloadTask;
    export let taskerror: DownloadTask = undefined;

    async function OnJobChangedCallback(changedJob: DownloadTask) {
        job = changedJob;
    }

    async function OnJobStatusChangedCallback(changedJob: DownloadTask) {
        OnJobChangedCallback(changedJob);
        dispatch('update');
    }

    onMount(() => {
        job.StatusChanged.Subscribe(OnJobStatusChangedCallback);
        job.ProgressChanged.Subscribe(OnJobChangedCallback);
    });
    onDestroy(() => {
        job.StatusChanged.Unsubscribe(OnJobStatusChangedCallback);
        job.ProgressChanged.Unsubscribe(OnJobChangedCallback);
    });

    const StatusIcons: Record<Status, 'active' | 'finished' | 'error'> = {
        [Status.Queued]: undefined,
        [Status.Paused]: undefined,
        [Status.Downloading]: 'active',
        [Status.Processing]: 'active',
        [Status.Failed]: 'error',
        [Status.Completed]: 'finished',
    };
</script>

<div class="task">
    <div class="progress">
        <ProgressBar
            status={StatusIcons[job.Status]}
            size="sm"
            value={job.Status === Status.Processing ? 100 : job.Progress * 100}
        >
            <div slot="labelText" class="label">
                {job.Media.Title}
                {#if job.Errors.length > 0}
                    <Button
                        kind="danger-ghost"
                        size="small"
                        icon={WarningHexFilled}
                        iconDescription={job.Errors[0].name}
                        on:click={(e) => {
                            taskerror = job;
                            e.stopPropagation();
                        }}
                    />
                {/if}
            </div>
        </ProgressBar>
    </div>
    <div class="action">
        <Button
            kind="ghost"
            size="small"
            icon={TrashCan}
            iconDescription="Delete"
            on:click={() => window.HakuNeko.DownloadManager.Dequeue(job)}
        />
    </div>
</div>

<style>
    .task {
        display: grid;
        grid-template-columns: 1fr 3em;
        gap: 1em;
        width: 100%;
        padding-left: 4em;
    }

    .label :global(button) {
        min-height: unset;
    }
</style>
