# Tutorials

## Preview/Download Media

Before downloading data, it is up to the user to determine which website shall be used to get the desired title.
For this example the title [Berserk](https://mangadex.org/title/801513ba-a712-498c-8f57-cae55b38cc92/berserk) from the MangaDex website will be used.

<iframe src="https://www.youtube.com/embed/Gs0BEJ7x9vo" width="100%" height="360" frameBorder="0" allowFullScreen></iframe>

1. First make sure to select a download directory in the settings where all downloaded titles shall be stored
2. Find and selet the website _MangaDex_
3. If the list of titles has not yet been synchronized or the list may be outdated, update the list now (depending on the selected website this may take some time)
4. Find and select the title _Berserk_
5. Load the list of current media items (chapters) for the title _Berserk_ from the website
6. Hover over a chapter in the media list and click the preview button to check the chapter content
7. Close the preview
8. Hover over a chapter in the media list again and click the download button to add this chapter to the download queue
9. Wait until the download is finished successfully
10. The download job may now be removed from the queue
11. Check the download directory

## Add/Remove Bookmark

...

<iframe src="https://www.youtube.com/embed/yDCkoHi9vKI" width="100%" height="360" frameBorder="0" allowFullScreen></iframe>

1. ...

## Apply URL from Browser

In some situations it may be useful to copy a link of a supported website title from the browser and paste it directly into HakuNeko (e.g., when updaing the title list takes very long).
For this example the title [Berserk](https://mangadex.org/title/801513ba-a712-498c-8f57-cae55b38cc92/berserk) from the MangaDex website will be used.

::: warning IMPORTANT
Only links to titles of supported websites can be applied (see the list of supported websites).
Only links to titles are valid, links to chapters or episodes cannot be applied.
:::

<iframe src="https://www.youtube.com/embed/tgq9UmDtDso" width="100%" height="360" frameBorder="0" allowFullScreen></iframe>

1. In your browser navigate to the desired website and title
2. Copy the URL from the browser
3. Switch to HakuNeko
4. Press the _Paste_ button in the [Title Selection Panel](./ui-reference#title-selection-panel)
5. Wait until the link is processed and the [Media Items Panel](./ui-reference#media-items-panel) finished loading

## Setup HakuNeko Assistant (Browser Extension)

This extension can be used to control HakuNeko from within the browser.

| HakuNeko RPC Settings | Assistant RPC Settings |
| :-------------------: | :--------------------: |
| ![](./assets/settings-application-rpc.webp) | ![](./assets/settings-assistant.webp) |

1. Start HakuNeko and open the application settings
2. Enable the option for _Remote Control_
3. You may change the _Port_ on which HakuNeko can be accessed by 3rd party applications
4. You must change the default _Secret_ to prevent unauthorized connections
5. Install the HakuNeko Assistant browser extension for Chrome/Edge
6. Download the latest extension from [GitHub](https://github.com/manga-download/haruneko-assistant/releases)
7. Extract the content of the extension (zip archive)
8. Open Chrome/Edge and switch to the extension manager
9. Enable the developer mode and load the extracted extension folder
10. Open the extension in your browser
11. Make sure the _Connection_ uses the same _Port_ number as configured in HakuNeko
12. Make sure the _Secret_ is the same as configured in HakuNeko

### Apply CloudFlare Bypass from Browser

Various websites are protected by CloudFlare's Anti-Bot detection.
Unfortunately HakuNeko is detected as malicious browser and therefore has trouble to bypass the protection.
This workaround can be used to temporary access a website that is protected by CloudFlare.

1. Make sure HakuNeko is running and _Remote Control_ is enabled
2. In your Chrome/Edge Browser navigate to the manga/chapter that is protected by CloudFlare
3. Wait until the CloudFlare protection is bypassed automatically or manually after solving a captcha
4. Stay on the same page and open the HakuNeko Assistant extension
5. Click the _Bypass CloudFlare_ button to send the session data to HakuNeko
6. Switch to HakuNeko and confirm a potential restart notification
7. The website can now be accessed by HakuNeko (until the CloudFlare session expires)