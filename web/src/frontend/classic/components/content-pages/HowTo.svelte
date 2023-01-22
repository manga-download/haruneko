<script lang="ts">
    import { Language, Plug, Renew, Search } from 'carbon-icons-svelte';

    import { fade } from 'svelte/transition';
</script>

<div id="howto" in:fade>
    <h2>QuickStart</h2>
    <h4>Find a site to get the content you want to view</h4>
    <div class="border">
        <p>
            <strong>HakuNeko</strong> is not hosting anything. Find a website on
            the internet that provides the content you want. Then :
        </p>
        <ol>
            <li>
                <Plug class="home-icons" /> Select your connector (the website).
                Use the filters
            </li>
            <li>
                <Renew class="home-icons" /> Click on the refresh button (can take
                minutes)
            </li>
            <li><Search class="home-icons" /> Find a manga</li>
            <li>
                <Language class="home-icons" /> Filter chapters by language (optional)
            </li>
            <li><Search class="home-icons" /> Select a chapter</li>
        </ol>
        <p>
            The connector you are looking for is not in the list ?<br />
            👉 Create a website request on the github (issue)<br />
            Use the copy/paste feature if you already have the manga link<br />
            👉 See the documentation for details
        </p>
    </div>
    <h4>Ready to go 🚀</h4>
    <div class="border">
        <p>Download, view, bookmark your favorite mangas 📚</p>
    </div>
</div>

<style>
    #howto {
        padding: 0.5em;
    }

    ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
    }

    li {
        margin-top: 5px;
    }

    :global(svg.home-icons) {
        margin-left: 5px;
        margin-right: 5px;
    }
</style>
