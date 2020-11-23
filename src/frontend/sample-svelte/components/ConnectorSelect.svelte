<script lang="ts">
    import {
        Button,
        Icon
    } from "carbon-components-svelte";
    import CloseOutline32 from "carbon-icons-svelte/lib/CloseOutline32";
    import CloseFilled32 from "carbon-icons-svelte/lib/CloseFilled32";
    let iconClose:any = CloseOutline32;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let message:String;

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
</style>
<div class="topleft">
    <span class="close inline">
        <Icon 
            render={iconClose} 
            on:mouseover="{() => {iconClose=CloseFilled32}}" 
            on:mouseleave="{() => {iconClose=CloseOutline32}}" 
            on:click={e => dispatch('close')}/>
    </span>
    <h3 class="inline">Connector Selection</h3>
</div>
<div class="content">🎉  {message}
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p>
    <p>
    Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
    </p> 🍾
</div>