import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabin',
        title: 'MangaBin'
    },
    container: {
        url: 'https://mangabin.com/manga/lord-of-fate-when-mutation-strikes/',
        id: JSON.stringify({ post: '228', slug: '/manga/lord-of-fate-when-mutation-strikes/' }),
        title: 'Lord of Fate: When Mutation Strikes'
    },
    child: {
        id: '/manga/lord-of-fate-when-mutation-strikes/chapter-75/',
        title: 'Chapter 75 - Fight until the last moment!'
    },
    entry: {
        index: 1,
        size: 115_762,
        type: 'image/jpeg'
    }
}).AssertWebsite();