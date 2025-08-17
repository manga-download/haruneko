import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaforfree',
        title: 'MangaForFree'
    },
    container: {
        url: 'https://mangaforfree.com/manga/brothel/',
        id: JSON.stringify({ post: '359566', slug: '/manga/brothel/' }),
        title: 'Brothel'
    },
    child: {
        id: '/manga/brothel/chapter-65-raw/',
        title: 'Chapter 65 raw'
    },
    entry: {
        index: 0,
        size: 269_969,
        type: 'image/jpeg'
    }
}).AssertWebsite();