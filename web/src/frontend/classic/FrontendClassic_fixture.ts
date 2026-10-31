import { type ElementHandle, TimeoutError } from 'puppeteer-core';
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
     * Close the startup guide if it is open.
     */
    public async EnsureNoStartupGuide() {
        //await super.Screenshot('START - FrontendClassicFixture.EnsureNoStartupGuide()');
        const page = await super.GetPage();
        let button: ElementHandle<HTMLButtonElement>;
        try {
            button = await page.waitForSelector('#startupGuide button.bx--modal-close', { visible: true, timeout: 5000 });
        } catch { }
        try {
            await button?.click();
            await page.waitForSelector('#startupGuide', { hidden: true, timeout: 5000 });
        } finally {
            //await super.Screenshot('END - FrontendClassicFixture.EnsureNoStartupGuide()');
        }
    }

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
        await super.Click(this.#selector.WebsiteFilter, timeout); // Required to open the drop-down
        await super.Click(`#Plugin #combo-PluginSelect #PluginSelect-${id}[role="option"] .title`, timeout);
    }

    /**
     * Click the button to update the manga list for the currently selected website.
     */
    public async UpdateWebsiteMangaList(timeout = 10_000) {
        await super.Screenshot('START - FrontendClassicFixture.UpdateWebsiteMangaList()');
        await super.Click('#Plugin button#MediaUpdateButton');
        const page = await super.GetPage();
        // await page.waitForSelector('#MediaList > div.loading', { visible: false, timeout });
        await Promise.race([
            page.waitForSelector('#MediaList > div.error', { visible: true, timeout }),
            page.waitForSelector('#MediaList div.media a.title', { visible: true, timeout }),
        ]);
        await super.Screenshot('END - FrontendClassicFixture.UpdateWebsiteMangaList()');
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

    async #GetMangaElement(title: string, timeout = 1000) {
        const selector = '#MediaList div.media > div.media';
        const selectorBookmarkText = 'a.title';
        const page = await super.GetPage();
        await page.waitForSelector(selector, { visible: true, timeout });
        const elements = await page.$$(selector);
        for (const element of elements) {
            const handle = await element.$(selectorBookmarkText);
            // biome-ignore lint/performance/useDomNodeTextContent: Layout awareness is required to strip whitespaces
            if (await handle.evaluate(anchor => anchor.innerText) === title) {
                return element;
            }
        }
        throw new Error(`Failed to find element(s) matching '${selector}' with text '${title}'`);
    }

    /**
     * Search for a manga with the matching {@link title} in the current manga list and click on it.
     */
    public async SelectManga(title: string, timeout = 1000) {
        return this.#GetMangaElement(title, timeout).then(div => div.click());
    }

    /**
     * Search for a manga with the matching {@link title} in the current manga list and click on its bookmark button.
     */
    public async BookmarkManga(title: string, timeout = 5000) {
        return this.#GetMangaElement(title, timeout)
            .then(div => div.waitForSelector('button[role="bookmark"]:not(.bookmarked)', { visible: true, timeout }))
            .then(button => button.click());
    }

    /**
     * Paste the given manga {@link url} into the application using the paste link button.
     */
    public async PasteMangaFromClipboard(url: string, timeout = 5000) {
        const page = await super.GetPage();
        await page.evaluate(link => navigator.clipboard.writeText(link), url);
        await super.Click('#Media #MediaTitle button[role="paste"]', timeout);
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

    async #ClickChapterButton(title: string, selector: string, timeout = 1000) {
        const selectorMediaItemLabels = '#ItemList div.listitem';
        const page = await super.GetPage();
        await page.waitForSelector(selectorMediaItemLabels, { visible: true, timeout });
        for (const element of await page.$$(selectorMediaItemLabels)) {
            const handle = await element.$('a.title');
            // biome-ignore lint/performance/useDomNodeTextContent: Layout awareness is required to strip whitespaces
            if (await handle.evaluate(anchor => anchor.innerText) === title) {
                return element.$(selector).then(element => element.click());
            }
        }
        throw new Error(`Failed to find element(s) matching '${selectorMediaItemLabels}' with text '${title}'`);
    }

    /**
     * Search for a chapter with the matching {@link title} in the current chapter list and click on its preview button.
     */
    public async ClickChapterPreview(title: string, timeout = 1000) {
        return this.#ClickChapterButton(title, 'button[role="preview"]', timeout);
    }

    /**
     * Search for a chapter with the matching {@link title} in the current chapter list and click on its download button.
     */
    public async ClickChapterDownload(title: string, timeout = 1000) {
        return this.#ClickChapterButton(title, 'button[role="download"]', timeout);
    }

    /**
     * Get the preview image links.
     */
    public async GetPreviewImageLinks(count: number, timeout = 5000) {
        const selector = '#ImageViewer img.imgpreview';
        const page = await super.GetPage();
        await page.waitForSelector(selector, { visible: true, timeout });
        return new Promise<string[]>((resolve, reject) => {
            const timer = setInterval(async () => {
                const elements = await page.$$(selector);
                if (elements.length === count) {
                    resolve(Promise.all(elements.map(element => element.evaluate(img => img.src))));
                    clearInterval(timer);
                }
            }, 250);
            setTimeout(() => {
                clearInterval(timer);
                reject(new TimeoutError(`Failed to find ${count} element(s) matching '${selector}'`));
            }, timeout);
        });
    }
}