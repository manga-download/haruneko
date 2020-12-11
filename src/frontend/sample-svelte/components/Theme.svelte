<script context="module" lang="ts">
    export type Theme={
        id:string;
        label:string;
    }

    export const themes :Theme[] = [
        {id: "hakuneko", label:"Hakuneko"},
        {id: "white", label:"Carbon White"},
        {id: "g10", label:"Carbon g10 (light)"},
        {id: "g90", label:"Carbon g90 (dark)"},
        {id: "g100", label:"Carbon g100 (dark)"},
    ]
</script>

<script lang="ts">
    export let persist = false;
    export let persistKey = "theme";
    export let theme ='g90';

    import { onMount, afterUpdate, setContext } from "svelte";
    import { writable, derived } from "svelte/store";

    const isValidTheme = (value: string) => themes.find(element => element.id===value);;
    const isDark = (value: string) =>
        isValidTheme(value) && (value === "g90" || value === "g100");

    const dark = writable(isDark(theme));
    const light = derived(dark, (_) => !_);

    setContext("Theme", {
        updateVar: (name: string, value: string) => {
        document.documentElement.style.setProperty(name, value);
        },
        dark,
        light,
    });

    onMount(() => {
        try {
            const persistedTheme = localStorage.getItem(persistKey) || theme;
            if (isValidTheme(persistedTheme)) {
                theme = persistedTheme;
            }
        } catch (error) {
        console.error(error);
        }
    });

    afterUpdate(() => {
        if (isValidTheme(theme)) {
        document.documentElement.setAttribute("theme", theme);
        if (persist) {
            localStorage.setItem(persistKey, theme);
        }
        } else {
        console.warn(
            `"${theme}" is not a valid Carbon theme. Choose from available themes: ${JSON.stringify(
            themes
            )}`
        );
        }
    });

    $: dark.set(isDark(theme));
</script>

<slot />  