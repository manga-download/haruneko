import { describe, it/*, expect*/ } from 'vitest';
import { TestFixture } from './FrontendClassic_fixture';

describe('Front-End (Classic)', { concurrent: false, timeout: 60_000 }, () => {

    describe('Bookmarks', async () => {

        const fixture = new TestFixture();

        it('Should bookmark a media title that is not yet bookmarked', async () => {

            // TODO: Ensure bookmark list is empty

            await fixture.SetWebsiteFilter('Dex');
            await fixture.SelectWebsite('mangadex');
            await fixture.UpdateWebsiteMediaTitles();
            await fixture.SetMediaTitleFilter('Apple');
            await fixture.BookmarkMediaTitle('Apple Collection');

            await fixture.SetWebsiteFilter('Bookmarks');
            await fixture.SelectWebsite('bookmarks');
            await fixture.SetMediaTitleFilter('Apple');
            fixture.SelectMediaTitle('Apple Collection');
        });
    });
});