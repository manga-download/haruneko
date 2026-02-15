<script lang="ts">
    import { onDestroy } from 'svelte';
    import {
        Button,
        ClickableTile,
        Modal,
        ProgressBar,
    } from 'carbon-components-svelte';
    import Clean from 'carbon-icons-svelte/lib/Clean.svelte';
    import CloudDownload from 'carbon-icons-svelte/lib/CloudDownload.svelte';
    import RetryFailed from 'carbon-icons-svelte/lib/RetryFailed.svelte';
    import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
    import { DownloadTask, Status } from '../../../engine/DownloadTask';
    import DownloadManager from './DownloadManager.svelte';

    let previousTasks: DownloadTask[] = $state([]);
    let currentDownload: DownloadTask = $state();
    let completed = $state(0);
    let failed = $state(0);
    let processing = $state(0);
    let progress: number = $state(0);
    let status: Status = $state();
    let isModalOpen = $state(false);
    let downloadTasks: DownloadTask[] = $state(HakuNeko.DownloadManager.Queue.Value);

    function refreshCounts() {
        completed = downloadTasks.filter(
            (job) => job.Status.Value === Status.Completed,
        ).length;
        failed = downloadTasks.filter(
            (job) => job.Status.Value === Status.Failed,
        ).length;
        processing = downloadTasks.filter((job) =>
            [Status.Downloading, Status.Processing].includes(job.Status.Value),
        ).length;
    }

    function refreshProgress() {
        status = currentDownload.Status.Value;
        switch (status) {
            case Status.Downloading:
                progress = currentDownload.Progress.Value;
                break;
            case Status.Completed:
                progress = 1;
                break;
            case Status.Processing:
                progress = 1;
                break;
            default:
                progress = 0;
                break;
        }
    }

    HakuNeko.DownloadManager.Queue.Subscribe((tasks) => {
        const removed = previousTasks.filter((task) => !tasks.includes(task));
        const added = tasks.filter((task) => !previousTasks.includes(task));
        removed.forEach((job) => job.Status.Unsubscribe(refreshStatus));
        added.forEach((job) => job.Status.Subscribe(refreshStatus));
        previousTasks = [...tasks];
        downloadTasks = tasks;
        refreshCounts();
    });

    async function refreshStatus() {
        const nowDownloading = downloadTasks.filter((job) =>
            [Status.Downloading, Status.Processing].includes(job.Status.Value),
        )[0];
        if (nowDownloading && nowDownloading !== currentDownload) {
            currentDownload?.Status.Unsubscribe(refreshProgress);
            currentDownload?.Progress.Unsubscribe(refreshProgress);
            currentDownload = nowDownloading;
            currentDownload.Progress.Subscribe(refreshProgress);
            currentDownload.Status.Subscribe(refreshProgress);
        }
        refreshCounts();
    }

    onDestroy(() => {
        currentDownload?.Progress.Unsubscribe(refreshProgress);
        currentDownload?.Status.Unsubscribe(refreshProgress);
        downloadTasks.forEach((job) => job.Status.Unsubscribe(refreshStatus));
    });

    const statusmap: Record<Status, 'active' | 'finished' | 'error'> = {
        [Status.Paused]: 'active',
        [Status.Queued]: 'active',
        [Status.Downloading]: 'active',
        [Status.Processing]: 'active',
        [Status.Completed]: 'finished',
        [Status.Failed]: 'error',
    };

    async function deleteTasks(statusFilter?:Status) {
        downloadTasks.forEach((task) => {
            if(!statusFilter || statusFilter === task.Status.Value) window.HakuNeko.DownloadManager.Dequeue(task);
        });
        refreshStatus();
    }

    async function retryTasks(statusFilter?:Status) {
        downloadTasks.forEach((task) => {
            if(!statusFilter || statusFilter === task.Status.Value) task.Run();
        });
        refreshStatus();
    }

</script>

{#if isModalOpen}
    <Modal bind:open={isModalOpen} size="lg" passiveModal hasScrollingContent
        ><DownloadManager />
        <div slot="heading">
            Download Tasks
            <Button
                kind="secondary"
                size="small"
                icon={Clean}
                iconDescription="Clear finished tasks"
                on:click={() => deleteTasks(Status.Completed)}
            />
            <Button
                size="small"
                icon={RetryFailed}
                iconDescription="Retry failed tasks"
                on:click={() => retryTasks(Status.Failed)}
            />
            <Button
                kind="danger-tertiary"
                size="small"
                icon={TrashCan}
                iconDescription="Delete all tasks"
                on:click={() => deleteTasks()}
            />
        </div>
    </Modal>
{/if}
<ClickableTile on:click={() => (isModalOpen = true)}>
    <div id="tasksstatus">
        <div class="label">
            <CloudDownload size={32}></CloudDownload>
            <div class="count">
                Downloads ({downloadTasks.filter((job) =>
                    [
                        Status.Downloading,
                        Status.Processing,
                        Status.Queued,
                    ].includes(job.Status.Value),
                )?.length})
            </div>
        </div>
        <div class="downloads">
            {#if downloadTasks.length > 0}
                <div class="progress">
                    {#if currentDownload}
                        <ProgressBar
                            value={progress * 100}
                            status={statusmap[status]}
                            labelText="[{currentDownload.Media.Parent
                                .Title}] {currentDownload.Media.Title}"
                        ></ProgressBar>
                    {:else}
                        <ProgressBar size="sm" value={0} labelText="<no tasks>"
                        ></ProgressBar>
                    {/if}
                </div>
                <div class="total">
                    <div
                        class="bar val-processing"
                        style:flex-basis="{(processing / downloadTasks.length) *
                            100}%"
                    ></div>
                    <div
                        class="bar val-completed"
                        style:flex-basis="{(completed / downloadTasks.length) *
                            100}%"
                    ></div>
                    <div
                        class="bar val-failed"
                        style:flex-basis="{(failed / downloadTasks.length) *
                            100}%"
                    ></div>
                    <div
                        class="bar val-pending"
                        style:flex-basis="{((downloadTasks.length -
                            completed -
                            failed -
                            processing) /
                            downloadTasks.length) *
                            100}%"
                    ></div>
                </div>
            {/if}
        </div>
    </div>
</ClickableTile>

<style>
    #tasksstatus {
        display: grid;
        grid-template-columns: fit-content(10em) 1fr;
    }
    #tasksstatus .label {
        text-align: center;
        margin-right: 2em;
    }
    #tasksstatus .label .count {
        top: 12em;
    }
    #tasksstatus .downloads .progress {
        margin-bottom: 0.5em;
    }

    #tasksstatus .downloads .total {
        border-radius: 0.5em;
        overflow: hidden;
        height: 1em;
        display: flex;
        align-items: stretch;
        justify-content: flex-start;
    }

    #tasksstatus .total .bar {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: width 1s ease-in-out;
    }

    #tasksstatus .val-completed {
        background: var(--cds-support-success);
    }
    #tasksstatus .val-failed {
        background: var(--cds-support-error);
    }
    #tasksstatus .val-processing {
        background: var(--cds-support-info-inverse);
    }
    #tasksstatus .val-pending {
        background: var(--cds-background-active);
    }
</style>
