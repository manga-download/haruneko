<script lang="ts">
    import {
        Icon,
        Accordion,
        Tag,
        Tile
    } from "carbon-components-svelte";

    import CloseOutline32 from "carbon-icons-svelte/lib/CloseOutline32";
    import CloseFilled32 from "carbon-icons-svelte/lib/CloseFilled32";
    let iconClose:any = CloseOutline32;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type {IMangaHost} from '../../engine/MangaProvider';
    import Plugin from "./Plugin.svelte";

    export let pluginlist:Array<IMangaHost>;

</script>

<style>
    .content {
        text-align: center;
        overflow-y: scroll;
        overflow-x: hidden;
        height:calc(100vh - 7.5em);
    }
    .topleft{
        position:relative;
    }
    .close {
        width:min-content;
    }
    .inline{
        display:inline;
    }

    .inlinetable{
        display:inline-table;
    }
</style>
<div class="topleft">
    <span class="close inline">
        <Icon 
            render={iconClose} 
            on:mouseover={() => {iconClose=CloseFilled32}}
            on:mouseleave={() => {iconClose=CloseOutline32}}
            on:click={e => dispatch('close')}/>
    </span>
    <h3 class="inline">Plugin Selection</h3>
</div>
<div class="content">
    <span class="inlinetable">    
        <Tile>
            <span>Language</span>
            <Tag type="cyan">English</Tag>
            <Tag type="cyan">French</Tag>
            <Tag type="cyan">multi-lingual</Tag>
        </Tile>
    </span>
    <span class="inlinetable">
        <Tile>
            <span>Type</span>
            <Tag type="purple">Anime</Tag>
            <Tag type="purple">Manga</Tag>
            <Tag type="purple">Webtoon</Tag>
            <Tag type="purple">Novel</Tag>
        </Tile>
    </span>
    <span class="inlinetable">
        <Tile>
            <span>Other</span>
            <Tag>porn</Tag>
            <Tag>raw</Tag>
            <Tag>scanlation</Tag>
            <Tag>subbed</Tag>
        </Tile>
    </span>
    <Tile light>
        <span>Filter:</span>
        <Tag filter type="cyan">French</Tag>
        <Tag filter type="purple">Manga</Tag>
        <Tag filter>scanlation</Tag>
        <Tag filter>subbed</Tag>
    </Tile>
    <Tile>
        <Accordion align="start" size="sm">
            {#each pluginlist as item, i}
                <Plugin plugin={item} display="AccordionItem" on:select />
            {/each}
        </Accordion>
    </Tile>
</div>