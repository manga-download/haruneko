<script lang="ts">
    import {
        StructuredList,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
    } from 'carbon-components-svelte';
    import Image from 'carbon-icons-svelte/lib/Image.svelte';

    interface Request {
        type: string;
        status: string | undefined;
        url: URL | undefined;
        details: string;
    }

    let requests: Map<string, Request> = new Map();

    //var tabId:number = parseInt(window.location.search.substring(1));
    //console.log(tabId);
    //var tab: any;

    /*
    Frontend should not access paltform specific interfaces such as `chrome` or `nw`
    onMount(async () => {
        chrome.tabs.query({}, function (tabs) {
            tab = tabs[0];
            chrome.debugger.attach({ tabId: tab.id }, "1.0");
            chrome.debugger.sendCommand({ tabId: tab.id }, "Network.enable");
        });
        chrome.debugger.onEvent.addListener(onEvent);
    });

    window.addEventListener("unload", function () {
        chrome.debugger.detach({ tabId: tab.id });
    });

    function onEvent(debuggeeId: any, message: any, params: any) {
        if (tab.id != debuggeeId.tabId) return;
        if (message == "Network.requestWillBeSent") {
            //items to track
            let url: any = new URL(params.request.url);
            if (url.hostname !== "localhost") {
                requests.set(params.requestId, {
                    type: "get",
                    status: "",
                    url: url,
                    details: params.requestId,
                });
                requests = requests;
            }
        } else if (
            message == "Network.responseReceived" &&
            requests.has(params.requestId)
        ) {
            requests.set(params.requestId, {
                type: "resp",
                status: params.response.status,
                url: requests.get(params.requestId)?.url,
                details: params.requestId,
            });
            requests = requests;
        } else if (
            message == "Network.loadingFinished" &&
            requests.has(params.requestId)
        ) {
            requests.set(params.requestId, {
                type: "fin",
                status: requests.get(params.requestId)?.status,
                url: requests.get(params.requestId)?.url,
                details: params.requestId,
            });
            requests = requests;
        }
    }
    */
</script>

<div id="network">
    <StructuredList>
        <StructuredListBody>
            {#each [...requests] as [_, request] (request)}
                <StructuredListRow class="job">
                    <StructuredListCell class="type"
                        >{request.type}</StructuredListCell
                    >
                    <StructuredListCell class="status"
                        >{request.status}</StructuredListCell
                    >
                    <StructuredListCell class="domain"
                        >{request.url?.hostname}</StructuredListCell
                    >
                    <StructuredListCell class="id"
                        >{request.details}</StructuredListCell
                    >
                    <StructuredListCell class="action">
                        <button on:click={() => alert('clicked')}
                            ><Image /></button
                        >
                    </StructuredListCell>
                </StructuredListRow>
            {/each}
        </StructuredListBody>
    </StructuredList>
</div>

<style>
    button {
        all: unset;
        cursor: pointer;
    }
    #network {
        height: 100%;
        overflow-y: scroll;
    }
    :global(.job .bx--structured-list-td) {
        padding: 0;
    }
    :global(.job .type) {
        max-width: 3em;
        margin-right: 0.25em;
    }
    :global(.job .context) {
        max-width: 8em;
        margin-right: 0.25em;
    }
    :global(.job .contextDetail) {
        max-width: 8em;
        margin-right: 0.25em;
    }
    :global(.job .action) {
        max-width: 1em;
    }
    :global(.job .status .bx--inline-loading__animation) {
        height: 1em;
    }
</style>
