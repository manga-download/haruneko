import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'readfreecomics',
        title: 'ReadFreeComics'
    },
    container: {
        url: 'https://readfreecomics.com/webtoon-comic/martial-peak-001/',
        id: JSON.stringify({ post: '1882', slug: '/webtoon-comic/martial-peak-001/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/webtoon-comic/martial-peak-001/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 3,
        size: 137_286,
        type: 'image/jpeg'
    }
}).AssertWebsite();