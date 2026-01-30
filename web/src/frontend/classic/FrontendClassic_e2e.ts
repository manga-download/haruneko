import { describe, it/*, expect*/ } from 'vitest';
import { TestFixture } from './FrontendClassic_fixture';

describe('Front-End (Classic)', { concurrent: false, timeout: 60_000 }, () => {

    describe('Bookmarks', async () => {

        const fixture = new TestFixture();

        it('Should bookmark a media title that is not yet bookmarked', async () => {

            // TODO: Ensure bookmark list is empty

            await fixture.SetWebsiteFilter('Dex');
            await fixture.SelectWebsite('mangadex');
            await fixture.UpdateWebsiteMediaTitles(7500);
            await fixture.SetMediaTitleFilter('Apple');
            await fixture.Delay(250);
            await fixture.BookmarkMediaTitle('Apple Collection');

            await fixture.SetWebsiteFilter('Bookmarks');
            await fixture.SelectWebsite('bookmarks');
            await fixture.SetMediaTitleFilter('Apple');
            await fixture.SelectMediaTitle('Apple Collection');
        });

        it('Should display preview images when clicking on a bookmarked manga and a chapter', async () => {

            await fixture.SetWebsiteFilter('Bookmarks');
            await fixture.SelectWebsite('bookmarks');
            await fixture.SetMediaTitleFilter('Apple');
            await fixture.SelectMediaTitle('Apple Collection');

            // Wait for item list to be loaded
            const page = await fixture.GetPage();
            await page.waitForSelector('#ItemList .listitem', { timeout: 5000 });

            // Select the first available chapter
            await fixture.SelectFirstMediaItem();

            // Wait for preview images to load
            await fixture.WaitForPreviewImages(15000);

            // Verify preview images are displayed
            const imageCount = await fixture.GetPreviewImageCount();
            if (imageCount === 0) {
                throw new Error('No preview images were displayed');
            }
        });
    });
});