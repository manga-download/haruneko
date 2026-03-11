import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadistrict',
        title: 'MangaDistrict'
    },
    container: {
        url: 'https://mangadistrict.com/title/no-mans-land/',
        id: JSON.stringify({ post: '114637', slug: '/title/no-mans-land/' }),
        title: `No Man's Land`
    },
    child: {
        id: '/title/no-mans-land/chapter-48/',
        title: 'Chapter 48 - The Missing Queen'
    },
    entry: {
        index: 0,
        size: 1_218_270,
        type: 'image/jpeg'
    }
}).AssertWebsite();