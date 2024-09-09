<script lang="ts">
    /**
     * Adapted from: https://github.com/Prinzhorn/better-svelte-virtual-list
     */

    import { onMount, onDestroy } from 'svelte';

    // When using a `position: sticky` header or footer you need to pass the height here.
    export let footerHeight = 0;
    export let headerHeight = 0;
    export let items:any[];
    export let containerHeight:number;
    export let itemHeight:number;
    export let container:HTMLElement;
    let scrollTop=0;
    let frame:number;

    const dummySymbol = Symbol('dummy item');

    function sliceArray(arr:any[], start:number, end:number) {
      arr = arr.slice(start, end);

      let expectedLength = end - start;

      // If we don't have enough items we'll fill it up with dummy entries.
      // This makes everything a lot easier, consistent and less edge-casey.
      while (arr.length < expectedLength) {
        arr.push(dummySymbol);
      }
      return arr;
    }

    function shiftArray(arr:any[], count:number) {
      // Could probably be optimized, but it runs on just dozens of items so relax.
      for (let i = 0; i < count; i++) {
        arr.unshift(arr.pop());
      }
      return arr;
    }

    $: lostHeight = headerHeight + footerHeight;
    $: visibleHeight = containerHeight - lostHeight;
    $: spacerHeight = Math.max(visibleHeight, items.length * itemHeight);
    $: numItems = Math.ceil(visibleHeight / itemHeight) + 1;
    $: startIndex = Math.floor(scrollTop / itemHeight);
    $: endIndex = startIndex + numItems;
    $: numOverlap = startIndex % numItems;
    $: blockHeight = numItems * itemHeight;
    $: globalOffset = blockHeight * Math.floor(scrollTop / blockHeight);
    $: slice = shiftArray(sliceArray(items, startIndex, endIndex), numOverlap);

    function poll() {
        if (container?.scrollTop !== scrollTop) {
            scrollTop = container.scrollTop;
        }
        frame = requestAnimationFrame(poll);
    }
    onMount(() => {
        frame = requestAnimationFrame(poll);
    });
    onDestroy(() => {
        cancelAnimationFrame(frame);
    });
</script>

<div role="listbox" class="spacer" style="height: {spacerHeight}px;" tabindex="-1">
  {#each slice as item, index}
    <slot
      item={item === dummySymbol ? undefined : item}
      dummy={item === dummySymbol}
      y={globalOffset + (index < numOverlap ? blockHeight : 0)}
    />
  {/each}
</div>

<style>
  .spacer {
    width: 100%;

    /* Prevent the translated items from bleeding through, causing more scrolling */
    overflow: hidden;

    /* 2021 inline-block happy fun time  */
    font-size: 0;
    line-height: 0;
  }
</style>