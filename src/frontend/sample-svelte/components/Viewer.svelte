<script lang="ts">
    import type {IChapter,IPage } from '../../../engine/MangaProvider';

    export let chapter: IChapter | null;
    let pages: Promise<IPage[]> = chapter?.GetPages() ?? Promise.resolve([]);
</script>
<style>
    #viewer{
        height:100%;
        overflow-y: scroll;
    }
    .error {
        color: red;
    }
</style>
<div id="viewer">
    <h3>This is the viewer for chapter {chapter?.Title ?? 'unkown'}</h3>
    <div id="pages">
        {#await pages}
            <p>...loading chapter</p>
        {:then pages}
            {#each pages as pagefetch}
                {#await pagefetch.GetImage()}
                    <p>...loading image</p>
                {:then page}
                    <img alt="page" src="{page}"/>
                {:catch error}
                    <p class="error">{error.message}</p>
                {/await}
            {/each}
        {:catch error}
            <p class="error">Unable to load chapter : {error.message}</p>
        {/await}
    </div>
</div>