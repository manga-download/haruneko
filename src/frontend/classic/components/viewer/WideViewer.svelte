<script lang="ts">
    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import WideViewerSetting from './WideViewerSetting.svelte';
    import WebtoonViewer from './WebtoonViewer.svelte';
    import MangaViewer from './MangaViewer.svelte';
    import { Key, ViewerModeValue } from '../../SettingsStore';

    export let item: IMediaContainer;
    export let toggleThumbnailViewer: () => void;
    export let currentImageIndex: number;

    let imagePadding = 2;
    const title = item?.Parent?.Title ?? 'unkown';
</script>

<div class={$ViewerModeValue}>
    <WideViewerSetting {title} {toggleThumbnailViewer} />
    {#if $ViewerModeValue === Key.ViewerMode_Longstrip}
        <WebtoonViewer {item} {imagePadding} />
    {:else if $ViewerModeValue === Key.ViewerMode_Paginated}
        <MangaViewer
            {item}
            {currentImageIndex}
            {imagePadding}
        />
    {/if}
</div>

<style>
    div {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        overflow-y: scroll;
        z-index: 9000;
        background-color: var(--cds-ui-01);
    }

    /*  FIXME: For robustness this should be Key.ViewerMode_Paginated */
    .paginated {
        display: flex;
        align-items: center;
    }
</style>
