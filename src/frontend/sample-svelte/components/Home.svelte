<script>
    import Search16 from "carbon-icons-svelte/lib/Search16";
    import Plug16 from "carbon-icons-svelte/lib/Plug16";
    import Language16 from "carbon-icons-svelte/lib/Language16";
    import Renew16 from "carbon-icons-svelte/lib/Renew16";

    const iconsStyle = "margin-left: 5px; margin-right: 5px;";
</script>

<div id="Home">
    <h2>Welcome to HakuNeko</h2>
    <div>
        <p class="border">
            <img
                alt="hakuneko logo"
                class="logo"
                src="./img/logo.png"
                align="left"
            />
            <strong>HakuNeko</strong> was made to help users who download media
            for circumstances that requires offline usage. <br />
            The philosophy is <u>ad-hoc consumption</u>, get it when you want to
            read/watch it.<br />
            Read the "how to use" documentation at hakuneko.download
        </p>
    </div>
    <div>
        <h4>Find a site to get the content you want to view</h4>
        <div class="border">
            <p>
                <strong>HakuNeko</strong> is not hosting anything. Find a website
                on the internet that provides the content you want. Then :
            </p>
            <ol>
                <li>
                    <Plug16 style={iconsStyle} /> Select your connector (the website).
                    Use the filters
                </li>
                <li>
                    <Renew16 style={iconsStyle} /> Click on the refresh button (can
                    take minutes)
                </li>
                <li><Search16 style={iconsStyle} /> Find a manga</li>
                <li>
                    <Language16 style={iconsStyle} /> Filter chapters by language
                    (optional)
                </li>
                <li><Search16 style={iconsStyle} /> Select a chapter</li>
            </ol>
            <p>
                The connector you are looking for is not in the list ?<br />
                👉 Create a website request on the github (issue)<br />
                Use the copy/paste feature if you already have the manga link<br
                />
                👉 See the documentation for details
            </p>
        </div>
        <h4>Ready to go 🚀</h4>
        <div class="border">
            <p>Download, view, bookmark your favorite mangas 📚</p>
        </div>
    </div>
</div>

<style>
    #Home {
        padding: 0.5em;
    }
    .border {
        border: 2px solid var(--cds-ui-04);
        border-radius: 1em;
        background-color: var(--cds-ui-01);
        padding: 1em;
    }
    .logo {
        margin-right: 1em;
        border-radius: 10%;
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
</style>
