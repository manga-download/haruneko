<script lang="ts">
    import { afterUpdate } from "svelte";

    export let theme: string;

    afterUpdate(() => {
        document.documentElement.setAttribute("theme", theme);
    });
</script>

<slot />