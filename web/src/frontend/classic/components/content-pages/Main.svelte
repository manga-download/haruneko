<script lang="ts">
    import Logo from '../../../../img/logo.png';
    import { Tile } from 'carbon-components-svelte';
    import { fade } from 'svelte/transition';
    import Suggestions from '../Suggestions.svelte';
    import Documentation from './Documentation.svelte';
</script>

<div id="Home" in:fade>
    <Tile class="border" style="margin-bottom:1em;">
        <p>
            <img
                alt="hakuneko logo"
                class="logo"
                src={Logo}
                style="height:3em;"
            />
            <strong>HakuNeko</strong> was made to help users who download media
            for circumstances that requires offline usage. <br />
            The philosophy is <u>ad-hoc consumption</u>, get it when you want to
            read/watch it.
        </p>
    </Tile>
    <Suggestions />
    <Tile id="documentation" class="border ">
        <Documentation />
    </Tile>
</div>

<style>
    #Home {
        padding: 0.5em;
    }
    #Home :global(#Suggestions) {
        margin-bottom: 1em;
    }
    .logo {
        margin-right: 1em;
        border-radius: 10%;
        float: left;
    }
</style>
