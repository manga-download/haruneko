function BlockRequests() {
    return {
        cancel: true
    };
}

export function Initialize(patterns: string[]): void {
    // NOTE: parameter extraInfoSpec:
    //       'blocking'       => sync request required for header modification
    //       'requestHeaders' => allow change request headers?
    //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
    if(!chrome.webRequest.onBeforeSendHeaders.hasListener(BlockRequests)) {
        chrome.webRequest.onBeforeSendHeaders.addListener(BlockRequests, { urls: patterns }, [ 'blocking' ]);
    }

    // TODO: Swith to chrome.declarativeNetRequest
    //       => https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#evaluation
    //       chrome.declarativeWebRequest.onRequest.addRules(...);
    //       chrome.declarativeWebRequest.onRequest.addListener(...);
    /*
    chrome.declarativeWebRequest.onRequest.addRules([
        {
            conditions: [
                // new chrome.declarativeWebRequest.RequestMatcher(...)
                {
                    url: {
                        urlMatches: "google.com/[^?]*foo"
                    } as chrome.events.UrlFilter
                } as chrome.declarativeWebRequest.RequestMatcher
            ],
            actions: [
                //new chrome.declarativeWebRequest.CancelRequest()
                {
                    instanceType: 'declarativeWebRequest.CancelRequest'
                }
            ]
        } as chrome.events.Rule
    ]);
    */
}