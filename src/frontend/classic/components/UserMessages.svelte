<script lang="ts">
    import { Modal } from 'carbon-components-svelte';

    //Todo: just a POC Changing alert with extra args should be set inside the engine
    let openAlertMessage = false;
    let alertMessage = '';
    let alertTitle = '';
    let alertButton = '';
    window.alert = function (message, title = 'Alert', button = 'OK') {
        openAlertMessage = true;
        alertMessage = message;
        alertTitle = title;
        alertButton = button;
    };

    let openInfoMessage = false;
    let infoMessage = '';
    let infoTitle = '';
    let infoButton = '';
    // @ts-ignore: temp test
    window.info = function (message: string, title = 'Info', button = 'OK') {
        openInfoMessage = true;
        infoMessage = message;
        infoTitle = title;
        infoButton = button;
    };
</script>

<Modal
    danger
    bind:open={openAlertMessage}
    modalHeading={alertTitle}
    primaryButtonText={alertButton}
    on:click:button--primary={() => (openAlertMessage = false)}
    on:open
    on:close
    on:submit
>
    <p>{@html alertMessage}</p>
</Modal>

<Modal
    bind:open={openInfoMessage}
    modalHeading={infoTitle}
    primaryButtonText={infoButton}
    on:click:button--primary={() => (openInfoMessage = false)}
    on:open
    on:close
    on:submit
>
    <p>{@html infoMessage}</p>
</Modal>
