import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadistrict',
        title: 'MangaDistrict'
    },
    container: {
        url: 'https://mangadistrict.com/series/no-mans-land/',
        id: JSON.stringify({ post: '114637', slug: '/series/no-mans-land/' }),
        title: `No Man's Land`
    },
    child: {
        id: '/series/no-mans-land/chapter-48/',
        title: 'Chapter 48 - The Missing Queen'
    },
    entry: {
        index: 0,
        size: 1_218_270,
        type: 'image/jpeg'
    }
}).AssertWebsite();