import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangafort',
        title: 'MangaFort'
    },
    container: {
        url: 'https://mangafort.net/manga/the-gangster-baby-of-the-dukes-family/',
        id: JSON.stringify({ post: '2788', slug: '/manga/the-gangster-baby-of-the-dukes-family/' }),
        title: 'The Gangster Baby of the Duke’s Family'
    },
    child: {
        id: '/manga/the-gangster-baby-of-the-dukes-family/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 265_371,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());