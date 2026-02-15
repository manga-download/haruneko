<script lang="ts">
    export let theme: string;

    $effect(() => {
        document.documentElement.setAttribute("theme", theme);
    });
</script>

<slot />