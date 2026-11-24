<script>
    import { createTheme, Theme } from "carbon-components-svelte";
    import { SvelteMap } from "svelte/reactivity"
    import { Settings } from '../stores/Settings.svelte';

    const customThemes = new SvelteMap();
    customThemes.set("hakuneko",   {
        theme:"g100",
        tokens: createTheme({
            theme: "g100",
            brand: "#0f62fe",
            tokens: {
                "button-primary": "#da1e28",
                "button-primary-hover": "#b81922",
                "button-primary-active": "#750e13",
            }
        })
    });
    customThemes.set("sheepyneko", {
        theme: "g100",
        tokens: createTheme({
            theme: "g100",
            brand: "#8a3ffc",
            tokens: {
                background: "#610f33",
                field: "#480f28",
                layer: "#480f28",
                "layer-01": "#6d173d",
                "field-01": "#6d173d",
        }})
    });
    const theme = $derived(customThemes.get(Settings.Theme.Value)?.theme ?? Settings.Theme.Value);
    const tokens = $derived(customThemes.get(Settings.Theme.Value)?.tokens.tokens ?? {});
</script>

<Theme 
    {theme}
    {tokens}
/>