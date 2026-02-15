<script lang="ts">
    import { fly } from 'svelte/transition';
    import { CopyButton, ExpandableTile } from 'carbon-components-svelte';
    import DocumentDownload from 'carbon-icons-svelte/lib/DocumentDownload.svelte';

    import { DownloadTask, Status } from '../../../engine/DownloadTask';
    import DownloadManagerTask from './DownloadManagerTask.svelte';

    let taskerror: DownloadTask = $state();
    let downloadTasks: DownloadTask[] = $state(HakuNeko.DownloadManager.Queue.Value);

    HakuNeko.DownloadManager.Queue.Subscribe((tasks) => {
        downloadTasks = tasks;
    });

    let groupedJobs = $derived(Object.groupBy(
        downloadTasks,
        (elt) => elt.Media.Parent.Identifier,
    ));

    // No-op function kept for compatibility with DownloadManagerTask component
    // $derived() automatically tracks changes to downloadTasks, so manual updates are not needed
    function onUpdate() {}

    function copyErrorToClipBoard(task: DownloadTask) {
        let message = `${task.Media.Title}\r\n`;
        message += task.Errors.Value.map((error) => {
            return `${error.message}\r\n > ${error.stack}`;
        }).join('\r\n-------------------\r\n');

        // TODO: Remove depenencies to nwjs with an abstraction
        const clipboard = nw.Clipboard.get();
        clipboard.set(message, 'text');
        //navigator.clipboard.writeText(message);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="downloadmanager"
    on:click|stopPropagation={() => {
        taskerror = undefined;
    }}
>
    <div id="tasks">
        {#if downloadTasks.length > 0}
            {#each Object.entries(groupedJobs) as [media, mediajobs] (media)}
                {@const completed = mediajobs.filter(
                    (job) => job.Status.Value === Status.Completed,
                ).length}
                {@const failed = mediajobs.filter(
                    (job) => job.Status.Value === Status.Failed,
                ).length}
                {@const processing = mediajobs.filter((job) =>
                    [Status.Downloading, Status.Processing].includes(
                        job.Status.Value,
                    ),
                ).length}
                <ExpandableTile tileCollapsedLabel="Details">
                    <div slot="above">
                        <h6>
                            {mediajobs[0].Media.Parent.Title} [{mediajobs[0]
                                .Media.Parent.Parent.Title}]
                        </h6>
                        <div class="total">
                            <div
                                class="bar val-processing"
                                style:flex-basis="{(processing /
                                    mediajobs.length) *
                                    100}%"
                            ></div>
                            <div
                                class="bar val-completed"
                                style:flex-basis="{(completed /
                                    mediajobs.length) *
                                    100}%"
                            ></div>
                            <div
                                class="bar val-failed"
                                style:flex-basis="{(failed / mediajobs.length) *
                                    100}%"
                            ></div>
                            <div
                                class="bar val-pending"
                                style:flex-basis="{((mediajobs.length -
                                    completed -
                                    failed -
                                    processing) /
                                    mediajobs.length) *
                                    100}%"
                            ></div>
                        </div>
                    </div>
                    <div slot="below" class="below">
                        {#each mediajobs as job (job)}
                            <DownloadManagerTask
                                {job}
                                bind:taskerror
                                {onUpdate}
                            ></DownloadManagerTask>
                        {/each}
                    </div>
                </ExpandableTile>
            {/each}
        {:else}
            <div>
                <DocumentDownload size={32}></DocumentDownload> No tasks in queues
            </div>
        {/if}
    </div>

    {#if taskerror}
        <div
            id="taskerrors"
            transition:fly={{ x: 200, duration: 500 }}
            on:click|stopPropagation
        >
            <div class="copy">
                <CopyButton
                    text="Copy error messages"
                    copy={() => {
                        copyErrorToClipBoard(taskerror);
                    }}
                ></CopyButton>
                <h4>{taskerror.Media.Title}</h4>
            </div>
            {#each taskerror.Errors.Value as error}
                <div>{error.message}</div>
                <pre>{error.stack}</pre>
                <hr />
            {/each}
        </div>
    {/if}
</div>

<style>
    #tasks {
        height: 70vh;
    }
    #taskerrors {
        height: 100%; /* 100% Full-height */
        width: 50%; /* 0 width - change this with JavaScript */
        position: fixed; /* Stay in place */
        z-index: 1; /* Stay on top */
        top: 0; /* Stay at the top */
        right: 0;
        overflow: auto;
        padding: 1em;
        padding-top: 3em;
        background-color: var(--cds-layer-accent-hover);
        border-left: 5px solid var(--cds-border-subtle-selected);
    }
    .copy {
        margin-bottom: 1em;
    }
    .copy :global(.bx--copy-btn) {
        display: inline-block;
    }
    .copy h4 {
        display: inline;
        margin-left: 1em;
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
        background-color: var(--cds-support-success);
    }
    .total .val-failed {
        background-color: var(--cds-support-error);
    }
    .total .val-processing {
        background-color: var(--cds-support-info-inverse);
    }
    .total .val-pending {
        background-color: var(--cds-background-active);
    }
</style>
