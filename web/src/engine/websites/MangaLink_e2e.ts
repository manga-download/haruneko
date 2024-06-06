import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangalink',
        title: 'MangaLink'
    },
    container: {
        url: 'https://link-manga.com/readcomics/i-was-the-final-boss/',
        id: JSON.stringify({ post: '86560', slug: '/readcomics/i-was-the-final-boss/' }),
        title: 'I Was the Final Boss'
    },
    /* Recaptcha on chapter page
    child: {
        id: '/readcomics/i-was-the-final-boss/14/',
        title: '14'
    },
    entry: {
        index: 0,
        size: 1_805_356,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());