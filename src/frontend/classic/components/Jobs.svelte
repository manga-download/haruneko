<script lang="ts">
    import {
        StructuredList,
        StructuredListBody,
    } from 'carbon-components-svelte';
    import { onMount, onDestroy } from 'svelte';

    import type { IDownloadTask } from '../../../engine/DownloadTask';
    import Job from './Job.svelte';

    let jobs: IDownloadTask[] = [];
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
</script>

<div id="jobs">
    {#if jobs.length > 0}
        <StructuredList condensed>
            <StructuredListBody>
                {#each jobs as job}
                    <Job {job} />
                {/each}
            </StructuredListBody>
        </StructuredList>
    {:else}
        <div>No tasks in queues</div>
    {/if}
</div>

<style>
    #jobs {
        height: 100%;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>
