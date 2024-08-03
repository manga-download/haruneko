<script lang="ts">
    // TODO: text-overflow not working
    import { Button, ProgressBar } from 'carbon-components-svelte';
    import { TrashCan, WarningHexFilled } from 'carbon-icons-svelte';

    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type { DownloadTask } from '../../../engine/DownloadTask';
    import { Status } from '../../../engine/DownloadTask';

    export let job: DownloadTask;
    export let taskerror: DownloadTask = undefined;

    async function OnJobChangedCallback(_progress: number, changedJob: DownloadTask) {
        job = changedJob;
    }

    async function OnJobStatusChangedCallback(_status: Status, changedJob: DownloadTask) {
        OnJobChangedCallback(changedJob.Progress.Value, changedJob);
        dispatch('update');
    }

    onMount(() => {
        job.Status.Subscribe(OnJobStatusChangedCallback);
        job.Progress.Subscribe(OnJobChangedCallback);
    });
    onDestroy(() => {
        job.Status.Unsubscribe(OnJobStatusChangedCallback);
        job.Progress.Unsubscribe(OnJobChangedCallback);
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
            status={StatusIcons[job.Status.Value]}
            size="sm"
            value={job.Status.Value === Status.Processing ? 100 : job.Progress.Value * 100}
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
