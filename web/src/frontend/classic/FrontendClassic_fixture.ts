import { FrontendFixture } from '../../../test/FrontendFixture';

const selectorWebsiteFilter = `#Plugin input#PluginSelect`;
const selectorMediaTitleFilter = `#MediaFilter input#MediaFilterSearch`;
const selectorMediaItemFilter = `#ItemFilter input#ItemFilterSearch`;
const selectorMediaUpdateButton = `#Plugin button#MediaUpdateButton`;
const selectorMediaTitleLabels = `#MediaList .media`;

/**
 * A fixture providing specific functionality for testing the Classic front-end.
 */
export class TestFixture extends FrontendFixture {

    /**
     * Get the current text in the website search box.
     */
    public async GetWebsiteFilter() {
        return super.GetText(selectorWebsiteFilter);
    }

    /**
     * Set the current text in the website search box to {@link search}.
     */
    public async SetWebsiteFilter(search: string) {
        await super.SetText(selectorWebsiteFilter, search);
    }

    public async SelectWebsite(id: string) {
        const selector = `#Plugin [role="listbox"] #${id}[role="option"] .title`;
        const page = await super.GetPage();
        await page.click(selectorWebsiteFilter); // Requiured to open the drop-down
        await page.waitForSelector(selector, { timeout: 1000 });
        await page.click(selector);
    }

    /**
     * Click the button to update the media titles from the currently selected website.
     */
    public async UpdateWebsiteMediaTitles() {
        const page = await super.GetPage();
        await page.click(selectorMediaUpdateButton);
        await page.waitForSelector(selectorMediaTitleLabels, { timeout: 5000 });
    }

    /**
     * Get the current text in the media title search box.
     */
    public async GetMediaTitleFilter() {
        return super.GetText(selectorMediaTitleFilter);
    }

    /**
     * Set the current text in the media title search box to {@link search}.
     */
    public async SetMediaTitleFilter(search: string) {
        await super.SetText(selectorMediaTitleFilter, search);
    }

    /**
     * Search for a media title with the matching {@link text} in the current list and click on its bookmark button.
     */
    public async BookmarkMediaTitle(text: string) {
        const selectorMediaText = 'a.title';
        const selectorBookmarkButton = 'button:first-child';
        const page = await super.GetPage();
        const elements = await page.$$(selectorMediaTitleLabels);
        for(const element of elements) {
            if(await element.$eval(selectorMediaText, (a: HTMLAnchorElement) => a.innerText) === text) {
                const button = await element.$(selectorBookmarkButton);
                return button.click();
            }
        }
        throw new Error(`failed to find element matching selector '${selectorMediaTitleLabels} ${selectorMediaText}' with text '${text}'`);
    }

    /**
     * Search for a media title with the matching {@link text} in the current list and click on its text.
     */
    public async SelectMediaTitle(text: string) {
        const selectorMediaText = 'a.title';
        const page = await super.GetPage();
        const elements = await page.$$(`${selectorMediaTitleLabels} ${selectorMediaText}`);
        for(const element of elements) {
            if(await element.evaluate((anchor: HTMLAnchorElement) => anchor.innerText) === text) {
                return element.click();
            }
        }
        throw new Error(`failed to find element matching selector '${selectorMediaTitleLabels} ${selectorMediaText}' with text '${text}'`);
    }

    /**
     * Get the current text in the media item search box.
     */
    public async GetMediaItemFilter(search: string) {
        await super.SetText(selectorMediaItemFilter, search);
    }

    /**
     * Set the current text in the media item search box to {@link search}.
     */
    public async SetMediaItemFilter(search: string) {
        await super.SetText(selectorMediaItemFilter, search);
    }

    public async SelectMediaItem(_id: string) {
        throw new Error('Not Implemented!');
    }
}