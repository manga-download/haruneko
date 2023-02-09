export class IPC {

    constructor() {
        chrome.runtime.onMessage.addListener(this.Receive.bind(this));
    }

    private async Receive<M, R>(message: M, sender: chrome.runtime.MessageSender, callback: (response: R) => void) {
        console.log('IPC::App.Received', message, sender, callback);
        //callback();
    }

    private async Send<P, R>(payload: P): Promise<R> {
        const tab = await chrome.tabs.getCurrent();
        return chrome.tabs.sendMessage(tab?.id ?? 0, '');
        //chrome.runtime.sendMessage();
    }
}