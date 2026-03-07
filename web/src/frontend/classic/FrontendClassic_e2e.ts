import { describe, beforeEach, it, expect } from 'vitest';
import { TestFixture } from './FrontendClassic_fixture';

describe.sequential('Front-End (Classic)', { timeout: 60_000 }, () => {

    const fixture = new TestFixture();

    beforeEach(() => fixture.Reset('classic'));

    describe('Startup', async () => {

        it('Should render basic layout', async () => {
            await fixture.WaitForSelectors(5000,
                'div#app > header > a.bx--header__name',
                'div#app > nav.bx--side-nav__navigation',
                'div#app > main#hakunekoapp > div#Media > div#MediaList',
                'div#app > main#hakunekoapp > div#Item > div#ItemList',
                'div#app > main#hakunekoapp > div#Content > main > div#Home',
                'div#app > main#hakunekoapp > div#Bottom div.downloads',
            );
        });
    });

    describe('Bookmarks', async () => {

        it('Should bookmark a manga that is not yet bookmarked', async () => {
            await fixture.SetWebsiteFilter('Dex');
            await fixture.SelectWebsite('mangadex');
            await fixture.UpdateWebsiteMangaList(7500);
            await fixture.SetMangaFilter('Apple');
            await fixture.BookmarkManga('Apple Collection');
            await fixture.SetWebsiteFilter('Bookmarks');
            await fixture.SelectWebsite('bookmarks');
            await fixture.SetMangaFilter('Apple');
            await fixture.SelectManga('Apple Collection');
        });

        it('Should load preview images of a chapter', async () => {
            await fixture.PasteMangaFromClipboard('https://mangadex.org/title/a037e450-6537-4725-aa7b-189fb2586e09/');
            await fixture.ClickChapterPreview('Vol.01 Ch.0004 - Thirsty (en) [The Company]');
            for (const link of await fixture.GetPreviewImageLinks(14)) {
                expect(link?.startsWith('blob:https://localhost:5000/')).toBeTruthy();
            }
        });
    });
});