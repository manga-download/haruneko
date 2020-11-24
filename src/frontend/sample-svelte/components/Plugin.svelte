<script lang="ts">
    import {
        Button,
        Icon,
        AccordionItem,
        Tag,
    } from "carbon-components-svelte";

    import Image16 from "carbon-icons-svelte/lib/Image16";
    import NotebookReference16 from "carbon-icons-svelte/lib/NotebookReference16";
    

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type {IMangaHost} from '../../../engine/MangaProvider';

    export let plugin:IMangaHost;
	export let display = 'AccordionItem';
</script>
<style>
    .icon {
        width: 5%;
        display:inline-table;
    }
    .title{
        width: 40%;

        display:inline-table;
    }
    .identifier{
        width: 20%;
        display:inline-table;
    }
    .language{
        width: 20%;
        display:inline-table;
    }
    .select{
        width: 10%;
        display:inline-table;
    }

</style>
{#if display==='AccordionItem'}
    <AccordionItem>
        <div slot="title" class="line">
            <span class="icon"><Icon render={Image16} /></span>
            <span class="select">
                <Button 
                    icon={NotebookReference16}
                    size="small"
                    tooltipPosition="bottom"
                    tooltipAlignment="center"
                    iconDescription="Connector"
                    on:click={e => dispatch('select',plugin) }
                >
                Select
                </Button>
            </span>
            <span class="title">{plugin.Title}</span>
            <span class="identifier">{plugin.Identifier}</span>
            <span class="language">{#if plugin.Language}<Tag type="cyan">{plugin.Language}</Tag>{/if}</span>
        </div>
        <p>
            Bacon ipsum dolor amet bresaola sausage beef salami cupim picanha boudin meatball alcatra filet mignon beef 
            ribs hamburger flank chuck. Andouille boudin short loin tail pork loin. Spare ribs corned beef boudin cupim,
            pork loin jerky frankfurter swine ham buffalo porchetta tenderloin. Filet mignon ham hock drumstick porchetta
            rump, hamburger swine t-bone picanha kielbasa bacon. Buffalo shoulder t-bone tri-tip. Flank hamburger cow short
            loin meatball t-bone. Buffalo meatloaf rump ham short ribs, tenderloin beef shoulder.


        </p>
    </AccordionItem>
{/if}