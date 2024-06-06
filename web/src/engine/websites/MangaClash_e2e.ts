import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaclash',
        title: 'Manga Clash'
    },
    container: {
        url: 'https://toonclash.com/manga/trapped-in-a-webnovel-as-a-good-for-nothing/',
        id: JSON.stringify({ post: '20283', slug: '/manga/trapped-in-a-webnovel-as-a-good-for-nothing/' }),
        title: 'I Woke Up as the Villain'
    },
    child: {
        id: '/manga/trapped-in-a-webnovel-as-a-good-for-nothing/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 1_146_187,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());