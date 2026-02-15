<script lang="ts">
    interface Props {
        theme: string;
    }
    let { theme }: Props = $props();

    $effect(() => {
        document.documentElement.setAttribute("theme", theme);
    });
</script>

<slot />