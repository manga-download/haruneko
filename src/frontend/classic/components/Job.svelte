<script lang="ts">
    //TODO: text-overflow not working
    import {
        InlineLoading,
        ProgressBar,
        StructuredListRow,
        StructuredListCell,
    } from 'carbon-components-svelte';
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

    function getStatus(
        status: Status
    ): 'finished' | 'active' | 'error' | 'inactive' {
        switch (status) {
            case Status.Completed:
                return 'finished';
            case Status.Downloading:
                return 'active';
            case Status.Failed:
                return 'error';
            case Status.Paused:
                return 'inactive';
            case Status.Processing:
                return 'active';
            case Status.Queued:
                return 'inactive';
            default:
                return 'inactive';
        }
    }
</script>

<div class="job">
    <StructuredListRow>
        <StructuredListCell noWrap class="media">
            {job.Media.Parent.Title}
        </StructuredListCell>
        <StructuredListCell noWrap class="item"
            >{job.Media.Title}</StructuredListCell
        >
        <StructuredListCell noWrap class="status">
            <InlineLoading
                status={getStatus(job.Status)}
                description={job.Status}
            />
        </StructuredListCell>
        <StructuredListCell noWrap class="progress">
            {#if job.Progress > 1}
                <ProgressBar kind="inline" hideLabel value={job.Progress} />
            {/if}
        </StructuredListCell>
        <StructuredListCell noWrap class="action">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span on:click={() => window.HakuNeko.DownloadManager.Dequeue(job)}>
                <TrashCan size={20} />
            </span>
        </StructuredListCell>
    </StructuredListRow>
</div>

<style>
    .job :global(.media) {
        width: 8em;
        margin-right: 0.25em;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .job :global(.item) {
        width: 15em;
        margin-right: 0.25em;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .job :global(.status) {
        width: 5em;
        margin-right: 0.25em;
    }
    .job :global(.progress) {
        width: 5em;
    }
    .job :global(.action) {
        width: 2em;
    }
</style>
