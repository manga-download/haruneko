<script context="module" lang="ts">
    export type Theme = {
        id: string;
        label: string;
        kind: string;
    };

    export const themes: Theme[] = [
        { id: "hakuneko", label: "Hakuneko", kind: "dark" },
        { id: "white", label: "Carbon White", kind: "light" },
        { id: "g10", label: "Carbon g10 (light)", kind: "light" },
        { id: "g90", label: "Carbon g90 (dark)", kind: "dark" },
        { id: "g100", label: "Carbon g100 (dark)", kind: "dark" },
        { id: "sheepyneko", label: "SheepyNeko", kind: "light" },
    ];
</script>

<script lang="ts">
    import { afterUpdate } from "svelte";

    export let theme: string;

    const isValidTheme = (value: string) =>
        themes.find((element) => element.id === value);

    afterUpdate(() => {
        if (isValidTheme(theme)) {
            document.documentElement.setAttribute("theme", theme);
        } else {
            console.warn(
                `"${theme}" is not a valid Carbon theme. Choose from available themes: ${JSON.stringify(
                    themes
                )}`
            );
        }
    });
</script>

<slot />
