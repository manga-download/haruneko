<script lang="ts">
    import { 
        InlineLoading,
        StructuredList, StructuredListRow, StructuredListCell, StructuredListBody,
        Icon,
    } from "carbon-components-svelte";

    import Delete20 from "carbon-icons-svelte/lib/Delete20";

    interface Job{
        type:string;
        status:any;
        context:string;
        contextDetail:string;
        text:string;
    }
    let jobs:Job[]=[];
    jobs = [...jobs,{type:"Chapter",status:"active",context:"connector1",contextDetail:"Manga1",text:"4/32 images ..."}];
    jobs = [...jobs,{type:"Chapter",status:"inactive",context:"connector2",contextDetail:"Manga1",text:"cancelled"}];
    jobs = [...jobs,{type:"Chapter",status:"finished",context:"connector1",contextDetail:"Manga2",text:"32/32 images finished"}];
    jobs = [...jobs,{type:"Chapter",status:"error",context:"connector1",contextDetail:"Manga1",text:"4/32 images error"}];
    jobs = [...jobs,{type:"Chapter",status:"finished",context:"connector1",contextDetail:"Manga2",text:"32/32 images finished"}];
    jobs = [...jobs,{type:"Chapter",status:"error",context:"connector1",contextDetail:"Manga1",text:"4/32 images error"}];
    jobs = [...jobs,{type:"Chapter",status:"finished",context:"connector1",contextDetail:"Manga2",text:"32/32 images finished"}];
    jobs = [...jobs,{type:"Chapter",status:"error",context:"connector1",contextDetail:"Manga1",text:"4/32 images error"}];
    jobs = [...jobs,{type:"Chapter",status:"finished",context:"connector1",contextDetail:"Manga2",text:"32/32 images finished"}];
    jobs = [...jobs,{type:"Chapter",status:"error",context:"connector1",contextDetail:"Manga1",text:"4/32 images error"}];
</script>
<style>
    #jobs{
        height:100%;
        overflow-y: scroll;
    }
    :global(.job .bx--structured-list-td) {
        padding:0;
    }
    :global(.job .type) {
        max-width:3em;
        margin-right:0.25em;
    }
    :global(.job .context) {
        max-width:8em;
        margin-right:0.25em;
    }
    :global(.job .contextDetail) {
        max-width:8em;
        margin-right:0.25em;
    }
    :global(.job .action) {
        max-width:1em;
    }
    :global(.job .status .bx--inline-loading__animation) {
        height:1em;
    }

    
</style>

<div id="jobs">
    <StructuredList>
        <StructuredListBody>
            {#each jobs as job}
            <StructuredListRow class="job">
                <StructuredListCell class="type">{job.type}</StructuredListCell>
                <StructuredListCell class="context">{job.context}</StructuredListCell>
                <StructuredListCell class="contextDetail">{job.contextDetail}</StructuredListCell>
                <StructuredListCell class="status {job.type}" >
                    <InlineLoading status="{job.status}" description="{job.text}" />
                </StructuredListCell>
                <StructuredListCell class="action">
                    {#if job.status==="active"}
                        <Icon render={Delete20} on:click={()=>alert("clicked")}/>
                    {/if}
                </StructuredListCell>
            </StructuredListRow>
            {/each}
        </StructuredListBody>
    </StructuredList>
</div>