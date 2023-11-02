<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { ExpandableTile } from 'carbon-components-svelte';
    import DocumentDownload from 'carbon-icons-svelte/lib/DocumentDownload.svelte';

    import type { DownloadTask } from '../../../engine/DownloadTask';
    import DownloadManagerTask from './DownloadManagerTask.svelte';

    let jobs: DownloadTask[] = [];
    $: groupedJobs = groupBy(jobs, (elt) => elt.Media.Parent.Identifier);
    HakuNeko.DownloadManager.GetTasks().then((data) => (jobs = data));

    async function OnTasksChangedCallback() {
        jobs = await HakuNeko.DownloadManager.GetTasks();
    }

    onMount(async () => {
        OnTasksChangedCallback();
        HakuNeko.DownloadManager.TasksAdded.Subscribe(OnTasksChangedCallback);
        HakuNeko.DownloadManager.TasksRemoved.Subscribe(OnTasksChangedCallback);
    });
    onDestroy(() => {
        HakuNeko.DownloadManager.TasksAdded.Unsubscribe(OnTasksChangedCallback);
        HakuNeko.DownloadManager.TasksRemoved.Unsubscribe(
            OnTasksChangedCallback
        );
    });

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
    {#if jobs.length > 0}
        {#each Object.entries(groupedJobs) as [media, mediajobs] (media)}
            <ExpandableTile>
                <div slot="above">
                    <h6>
                        {mediajobs[0].Media.Parent.Title} [{mediajobs[0].Media
                            .Parent.Parent.Title}]
                    </h6>
                </div>
                <div slot="below">
                    {#each mediajobs as job (job)}
                        <DownloadManagerTask {job} />
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
</style>
