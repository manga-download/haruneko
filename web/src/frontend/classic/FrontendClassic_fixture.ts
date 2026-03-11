import { TimeoutError } from 'puppeteer-core';
import { FrontendFixture } from '../../../test/FrontendFixture';

/**
 * A fixture providing specific functionality for testing the Classic front-end.
 */
export class TestFixture extends FrontendFixture {

    readonly #selector = {
        WebsiteFilter: '#Plugin input#PluginSelect',
        MangaFilter: '#MediaFilter input#MediaFilterSearch',
        ChapterFilter: '#ItemFilter input#ItemFilterSearch',
    };

    /**
     * Get the current text in the website search box.
     */
    public async GetWebsiteFilter() {
        return super.GetText(this.#selector.WebsiteFilter);
    }

    /**
     * Set the current text in the website search box to {@link search}.
     */
    public async SetWebsiteFilter(search: string) {
        await super.SetText(this.#selector.WebsiteFilter, search);
    }

    /**
     * Click the option in the website selection list that corresponds to the given website plugin {@link id}.
     */
    public async SelectWebsite(id: string, timeout = 1000) {
        const selector = `#Plugin [role="listbox"] #${id}[role="option"] .title`;
        const page = await super.GetPage();
        await page.click(this.#selector.WebsiteFilter); // Required to open the drop-down
        await page.waitForSelector(selector, { timeout });
        await page.click(selector);
    }

    /**
     * Click the button to update the manga list for the currently selected website.
     */
    public async UpdateWebsiteMangaList(timeout = 5000) {
        const selector = '#Plugin button#MediaUpdateButton';
        const page = await super.GetPage();
        await page.click(selector);
        return super.Delay(timeout - timeout + 250);
        // TODO: Wait for spinner to dissapear in list?
    }

    /**
     * Get the current text in the manga search box.
     */
    public async GetMangaFilter() {
        return super.GetText(this.#selector.MangaFilter);
    }

    /**
     * Set the current text in the manga search box to {@link needle}.
     */
    public async SetMangaFilter(needle: string) {
        await super.SetText(this.#selector.MangaFilter, needle);
    }

    async #GetMangaElement(title: string, timeout = 5000) {
        const selector = '#MediaList div.media > div.media';
        const selectorBookmarkText = 'a.title';
        const page = await super.GetPage();
        await page.waitForSelector(selector, { timeout });
        const elements = await page.$$(selector);
        for (const element of elements) {
            const anchor = await element.$(selectorBookmarkText);
            if (await anchor.evaluate(anchor => anchor.innerText) === title) {
                return element;
            }
        }
    }

    /**
     * Search for a manga with the matching {@link title} in the current manga list and click on it.
     */
    public async SelectManga(title: string, timeout = 5000) {
        return this.#GetMangaElement(title, timeout).then(div => div.click());
    }

    /**
     * Search for a manga with the matching {@link title} in the current manga list and click on its bookmark button.
     */
    public async BookmarkManga(title: string, timeout = 5000) {
        return this.#GetMangaElement(title, timeout)
            .then(div => div.$('button[role="bookmark"]'))
            .then(button => button.click());
    }

    /**
     * Paste the given manga {@link url} into the application using the paste link button.
     */
    public async PasteMangaFromClipboard(url: string, timeout = 5000) {
        const page = await super.GetPage();
        await page.evaluate(link => navigator.clipboard.writeText(link), url);
        return page.waitForSelector('#Media #MediaTitle button[role="paste"]', { timeout }).then(button => button.click());
    }

    /**
     * Get the current text in the chapter search box.
     */
    public async GetChapterFilter(needle: string) {
        await super.SetText(this.#selector.ChapterFilter, needle);
    }

    /**
     * Set the current text in the chapter search box to {@link needle}.
     */
    public async SetChapterFilter(needle: string) {
        await super.SetText(this.#selector.ChapterFilter, needle);
    }

    async #ClickChapterElement(title: string, selector: string, timeout = 5000) {
        const selectorMediaItemLabels = '#ItemList div.listitem';
        const page = await super.GetPage();
        await page.waitForSelector(selectorMediaItemLabels, { timeout });
        for (const element of await page.$$(selectorMediaItemLabels)) {
            if (await element.$('a.title').then(handle => handle.evaluate(anchor => anchor.innerText)) === title) {
                return element.$(selector).then(element => element.click());
            }
        }
        throw new Error(`Failed to find element(s) matching '${selectorMediaItemLabels}' with text '${title}'`);
    }

    /**
     * Search for a chapter with the matching {@link title} in the current chapter list and click on its preview button.
     */
    public async ClickChapterPreview(title: string, timeout = 5000) {
        return this.#ClickChapterElement(title, 'button[role="preview"]', timeout);
    }

    /**
     * Search for a chapter with the matching {@link title} in the current chapter list and click on its download button.
     */
    public async ClickChapterDownload(title: string, timeout = 5000) {
        return this.#ClickChapterElement(title, 'button[role="download"]', timeout);
    }

    /**
     * Get the preview image links.
     */
    public async GetPreviewImageLinks(count: number, timeout = 5000) {
        const selector = '#ImageViewer img.imgpreview';
        const page = await super.GetPage();
        await page.waitForSelector(selector, { timeout });
        return new Promise<string[]>((resolve, reject) => {
            setTimeout(() => reject(new TimeoutError(`Failed to find ${count} element(s) matching '${selector}'`)), timeout);
            setInterval(async () => {
                const elements = await page.$$(selector);
                if (elements.length === count) {
                    resolve(Promise.all(elements.map(element => element.evaluate(img => img.src))));
                }
            }, 250);
        });
    }
}