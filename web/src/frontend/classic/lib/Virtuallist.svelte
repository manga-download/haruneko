<script lang="ts" generics="T">
  import { onDestroy, onMount,type Snippet } from 'svelte';
 
  interface Props<T> {
    items: T[];
    container: HTMLElement;
    containerHeight: number;
    itemHeight: number;
    children?: Snippet<[T]>;
  }

  let {
    items,
    container,
    containerHeight,
    itemHeight,
    children
  }: Props<T> = $props();
  
  let frame : number;
  let scrollTop = $state(0)

  // Poll the container for scroll changes
  function poll() {
    if (container?.scrollTop !== scrollTop) {
      scrollTop = container?.scrollTop;
    }
    frame = requestAnimationFrame(poll);
  }

  onMount(() => {
    frame = requestAnimationFrame(poll);
  });

  onDestroy(() => {
    cancelAnimationFrame(frame);
  });
  
  // Reset the scroll position on items change
  $effect(() => {
    items;
    scrollTop=0;
  });

  const extraItemsOffset=10;
  let spacerHeight = $derived(Math.max(containerHeight, items.length * itemHeight));
  let itemsPerFrame = $derived(Math.ceil(containerHeight / itemHeight) + 1);
  let firstItem = $derived(Math.floor(scrollTop / itemHeight));
  let lastItem = $derived(firstItem + itemsPerFrame);
  let firstDisplay = $derived(Math.max(0,firstItem - extraItemsOffset))
  let lastDisplay = $derived(lastItem + extraItemsOffset)
  let emptySpaceHeight = $derived(firstDisplay * itemHeight);
  let slice = $derived(items.slice(firstDisplay, lastDisplay));
</script>

<div class="spacer" style="height: {spacerHeight}px; padding-top:{emptySpaceHeight}px" tabindex="-1">
  {#each slice as item (item) }
    {@render children?.(item)}
  {/each}
</div>

<style>
  .spacer {
    width: 100%; 
    /* Prevent the items from bleeding through, causing more scrolling */
    overflow: hidden;
  }
</style>