import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaonlineteam',
        title: 'Manga Online Team'
    },
    container: {
        url: 'https://mangaonlineteam.com/manga/choujin-x/',
        id: JSON.stringify({ post: '9587', slug: '/manga/choujin-x/' }),
        title: 'Choujin X'
    },
    child: {
        id: '/manga/choujin-x/chapter-45/',
        title: 'Chapter 45'
    },
    entry: {
        index: 0,
        size: 156_953,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());