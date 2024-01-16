import type { IBloatGuard } from '../BloatGuard';

export default class implements IBloatGuard {

    constructor(private readonly patterns: Array<string>) {}

    private BlockRequests() {
        return {
            cancel: true
        };
    }

    public Initialize() {
        // NOTE: parameter extraInfoSpec:
        //       'blocking'       => sync request required for header modification
        //       'requestHeaders' => allow change request headers?
        //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
        if(!chrome.webRequest.onBeforeSendHeaders.hasListener(this.BlockRequests)) {
            chrome.webRequest.onBeforeSendHeaders.addListener(this.BlockRequests, { urls: this.patterns }, [ 'blocking' ]);
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
}