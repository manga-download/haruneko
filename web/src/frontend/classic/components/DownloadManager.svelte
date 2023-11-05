<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { ExpandableTile } from 'carbon-components-svelte';
    import DocumentDownload from 'carbon-icons-svelte/lib/DocumentDownload.svelte';

    import { Status } from '../../../engine/DownloadTask';
    import { DownloadTasks } from '../stores/Stores';
    import DownloadManagerTask from './DownloadManagerTask.svelte';

    $: groupedJobs = groupBy(
        $DownloadTasks,
        (elt) => elt.Media.Parent.Identifier
    );
    function update() {
        groupedJobs = groupedJobs;
    }
    function groupBy<T>(
        arr: T[],
        keysSupplier: (item: T) => any
    ): Record<string, T[]> {
        return arr.reduce<Record<string, T[]>>((prev, curr) => {
            const groupKey = keysSupplier(curr);
            const group = prev[groupKey] || [];
            group.push(curr);
            return { ...prev, [groupKey]: group };
        }, {});
    }
</script>

<div id="jobs">
    {#if $DownloadTasks.length > 0}
        {#each Object.entries(groupedJobs) as [media, mediajobs] (media)}
            {@const completed = mediajobs.filter(
                (job) => job.Status === Status.Completed
            ).length}
            {@const failed = mediajobs.filter(
                (job) => job.Status === Status.Failed
            ).length}
            {@const processing = mediajobs.filter((job) =>
                [Status.Downloading, Status.Processing].includes(job.Status)
            ).length}
            <ExpandableTile tileCollapsedLabel="Details">
                <div slot="above">
                    <h6>
                        {mediajobs[0].Media.Parent.Title} [{mediajobs[0].Media
                            .Parent.Parent.Title}]
                    </h6>
                    <div class="total">
                        <div
                            class="bar val-processing"
                            style:flex-basis="{(processing / mediajobs.length) *
                                100}%"
                        />
                        <div
                            class="bar val-completed"
                            style:flex-basis="{(completed / mediajobs.length) *
                                100}%"
                        />
                        <div
                            class="bar val-failed"
                            style:flex-basis="{(failed / mediajobs.length) *
                                100}%"
                        />
                        <div
                            class="bar val-pending"
                            style:flex-basis="{((mediajobs.length -
                                completed -
                                failed -
                                processing) /
                                mediajobs.length) *
                                100}%"
                        />
                    </div>
                </div>
                <div slot="below" class="below">
                    {#each mediajobs as job (job)}
                        <DownloadManagerTask {job} on:update={update} />
                    {/each}
                </div>
            </ExpandableTile>
        {/each}
    {:else}
        <div><DocumentDownload size={32} /> No tasks in queues</div>
    {/if}
</div>

<style>
    #jobs {
        height: 100%;
        width: 100%;
        overflow-y: scroll;
    }

    .below {
        margin-bottom: 1em;
    }

    .total {
        border-radius: 0.5em;
        overflow: hidden;
        height: 1.2em;
        display: flex;
        align-items: stretch;
        justify-content: flex-start;
        margin: 0.5em;
    }

    .total .bar {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: width 1s ease-in-out;
    }

    .total .val-completed {
        background: var(--cds-support-success);
    }
    .total .val-failed {
        background: var(--cds-support-error);
    }
    .total .val-processing {
        background: var(--cds-support-info-inverse);
    }
    .total .val-pending {
        background: var(--cds-background-active);
    }
</style>
