<script>
    import Logo from '../../../../img/logo.png';
    import { Tile, ClickableTile } from 'carbon-components-svelte';
    import { useNavigate } from 'svelte-navigator';
    import { fade } from 'svelte/transition';
    import Suggestions from '../Suggestions.svelte';

    const navigate = useNavigate();
</script>

<div id="Home" in:fade>
    <Tile class="border" style="margin-bottom:1em;">
        <p>
            <img
                alt="hakuneko logo"
                class="logo"
                src={Logo}
                align="left"
                style="height:3em;"
            />
            <strong>HakuNeko</strong> was made to help users who download media
            for circumstances that requires offline usage. <br />
            The philosophy is <u>ad-hoc consumption</u>, get it when you want to
            read/watch it.
        </p>
    </Tile>
    <Suggestions />

    <Tile class="border">
        <h3>Guides</h3>
        <div class="guides">
            <ClickableTile light on:click={() => navigate('/howto')}
                >🚀 QuickStart
            </ClickableTile>
            <ClickableTile light on:click={() => navigate('/doc')}
                >📖 Documentation
            </ClickableTile>
        </div>
        <div class="guides">
            <ClickableTile light on:click={() => navigate('/guides/sources')}>
                🔗 Find your source
            </ClickableTile>
            <ClickableTile light on:click={() => navigate('/guides/plugins')}>
                🔌 Select a plugin
            </ClickableTile>
            <ClickableTile
                light
                on:click={() => navigate('/guides/item-download')}
            >
                🔽 Download
            </ClickableTile>
            <ClickableTile
                light
                on:click={() => navigate('/guides/item-preview')}
            >
                👁️‍🗨️ Preview
            </ClickableTile>
            <ClickableTile light on:click={() => navigate('/guides/bookmarks')}>
                🔖 Bookmarks your favorites
            </ClickableTile>
        </div>
        <div class="guides">
            <ClickableTile
                light
                on:click={() => navigate('/guides/newconnector')}
            >
                ✍ Suggest a new connector
            </ClickableTile>
            <ClickableTile light on:click={() => navigate('/guides/bookmarks')}>
                ❗ Something is not working
            </ClickableTile>
            <ClickableTile
                light
                on:click={() => navigate('/may/peace/come/to/ukraine/soon')}
            >
                Send harucoins to Ukraine
            </ClickableTile>
        </div>
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
    }

    .guides {
        display: flex;
        flex-flow: row wrap;
    }
    .guides > :global(*) {
        flex: 0 1 calc(33% - 0.5em);
        margin: 0.2em;
    }
</style>
