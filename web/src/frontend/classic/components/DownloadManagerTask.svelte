<script lang="ts">
    //TODO: text-overflow not working
    import { ProgressBar } from 'carbon-components-svelte';
    import { TrashCan } from 'carbon-icons-svelte';

    import { onMount, onDestroy } from 'svelte';

    import type { IDownloadTask } from '../../../engine/DownloadTask';
    import { Status } from '../../../engine/DownloadTask';

    export let job: IDownloadTask;

    async function OnJobChangedCallback(changedJob: IDownloadTask) {
        job = changedJob;
    }

    onMount(() => {
        job.StatusChanged.Subscribe(OnJobChangedCallback);
        job.ProgressChanged.Subscribe(OnJobChangedCallback);
    });
    onDestroy(() => {
        job.StatusChanged.Unsubscribe(OnJobChangedCallback);
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
    let value: number = undefined;
    $: value = job.Status === Status.Processing ? 100 : job.Progress * 100;
</script>

<div class="task">
    <div class="progress">
        <ProgressBar
            labelText={job.Media.Title}
            status={StatusIcons[job.Status]}
            size="sm"
            {value}
        />
    </div>
    <div class="action">
        <button
            on:click|preventDefault|stopPropagation={() =>
                window.HakuNeko.DownloadManager.Dequeue(job)}
            on:keypress
        >
            <TrashCan size={20} />
        </button>
    </div>
</div>

<style>
    .task {
        display: grid;
        grid-template-columns: 1fr 2em;
        width: 100%;
    }
    .task .progress :global(.bx--progress-bar) {
        width: 100%;
        max-width: 30em;
    }
    .task .progress :global(.bx--progress-bar__label) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 2em;
    }
    .task .progress :global(.bx--progress-bar__label svg) {
        left: 0;
        position: absolute;
    }
</style>
