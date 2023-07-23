<script lang="ts">
    /*
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    */
</script>

<div id="FullScreen">
    <!-- disablePictureInPicture controlsList="nodownload nofullscreen" 
    <video id="Video" controls>
        dummy tracks to show subtitle menu in video player
        <template is="dom-repeat" items="[[ media.subtitles ]]">
            <track
                kind="captions"
                src="data:text/vtt,WEBVTT"
                label="[[ item.locale ]]"
                srclang="[[ item.locale ]]"
            />
        </template>
        
    </video>
    -->
</div>

<style>
    #FullScreen {
        width: 100%;
        height: 100%;
        background-color: var(--cds-ui-01);
    }
    /*
    #Video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        outline: none !important;
    }
    video::-webkit-media-controls-fullscreen-button {
        display: none;
    }
    */
    /* hack to allow video to expand size when wrapped in subtitle container 
        .ASS-container,.ASS-container svg
    */
    /* .ASS-container {
        width: 100% !important;
        height: 100% !important;
    } */
    /* hack to show subtitles when video is in fullscreen mode */
    /* .ASS-stage {
        z-index: 2147483647;
    } */
</style>
