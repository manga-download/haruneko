import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'allmangato',
        title: 'AllManga.to'
    },
    container: {
        url: 'https://allmanga.to/manga/kFvrdRcbubPjrhr63',
        id: 'kFvrdRcbubPjrhr63',
        title: 'Yuan Zun'
    },
    child: {
        id: JSON.stringify({id: '643.5', translation: 'sub'}),
        title: 'Chapter 643.5 [sub]'
    },
    entry: {
        index: 0,
        size: 714_974, // 715_757
        type: 'image/jpeg'
    }
}).AssertWebsite();