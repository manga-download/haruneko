<script lang="ts">
    import { Button, AccordionItem, Tag } from "carbon-components-svelte";

    import Image16 from "carbon-icons-svelte/lib/Image16";
    import NotebookReference16 from "carbon-icons-svelte/lib/NotebookReference16";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import type { IMangaHost } from "../../../engine/MangaProvider";

    export let plugin: IMangaHost;
    export let display = "AccordionItem";
</script>

{#if display === "AccordionItem"}
    <AccordionItem>
        <div slot="title" class="line">
            <div class="icon"><Image16 /></div>
            <div class="select">
                <Button
                    icon={NotebookReference16}
                    kind="secondary"
                    size="small"
                    tooltipPosition="bottom"
                    tooltipAlignment="center"
                    iconDescription="Connector"
                    on:click={(e) => dispatch("select", plugin)}
                >
                    Select
                </Button>
            </div>
            <div class="title">{plugin.Title}</div>
            <div class="identifier">{plugin.Identifier}</div>
            <div class="language">
                {#if plugin.Language}<Tag type="cyan">{plugin.Language}</Tag
                    >{/if}
            </div>
        </div>
        <p>
            Bacon ipsum dolor amet bresaola sausage beef salami cupim picanha
            boudin meatball alcatra filet mignon beef ribs hamburger flank
            chuck. Andouille boudin short loin tail pork loin. Spare ribs corned
            beef boudin cupim, pork loin jerky frankfurter swine ham buffalo
            porchetta tenderloin. Filet mignon ham hock drumstick porchetta
            rump, hamburger swine t-bone picanha kielbasa bacon. Buffalo
            shoulder t-bone tri-tip. Flank hamburger cow short loin meatball
            t-bone. Buffalo meatloaf rump ham short ribs, tenderloin beef
            shoulder.
        </p>
    </AccordionItem>
{/if}

<style>
    .icon {
        width: 5%;
        display: inline-table;
    }
    .title {
        width: 40%;

        display: inline-table;
    }
    .identifier {
        width: 20%;
        display: inline-table;
    }
    .language {
        width: 20%;
        display: inline-table;
    }
    .select {
        width: 10%;
        display: inline-table;
    }
</style>
