<script lang="ts">
    import {
        StructuredList,
        StructuredListHead,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
    } from "carbon-components-svelte";

    interface ConsoleItem{
        type:string;
        text:string;
    }
    let consoleitems:ConsoleItem[]=[];

    const log = window.console.log.bind(console)
    console.log = (...args:any) => {
        consoleitems=[...consoleitems,{type:"log",text:args}];
        log(...args)
    }
    const info = window.console.info.bind(console)
    console.info = (...args:any) => {
        consoleitems=[...consoleitems,{type:"info",text:args}];
        info(...args)
    }
    const error = window.console.error.bind(console)
    console.error = (...args:any) => {
        consoleitems=[...consoleitems,{type:"error",text:args}];
        error(...args)
    }
    const warn = window.console.warn.bind(console)
    console.warn = (...args:any) => {
        consoleitems=[...consoleitems,{type:"warn",text:args}];
        warn(...args)
    }
    console.log("console.log from code");
    console.info("console.info from code");
    console.error("console.error from code");
    console.warn("console.warn from code");

</script>
<style>
    #console{
        height:100%;
        overflow-y: scroll;
    }

    :global(.log) {color:black;background-color:grey;}
    :global(.info) {color:black;background-color: darkcyan;}
    :global(.error) {color:white;background-color: red;}
    :global(.warn) {color:black;background-color: yellow;}
    .type{display:table-cell;width:3em;padding-left:0.2em;}
    .text{display:table-cell;padding-left:0.2em;}

</style>
<div id="console">
    {#each consoleitems as consoleitem}
        <div class="consoleitem ">
            <div class="type {consoleitem.type}">{consoleitem.type}</div>
            <div class="text">{consoleitem.text}</div>
        </div>
    {/each}
</div>