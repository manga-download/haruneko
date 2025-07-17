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
        id: JSON.stringify({ id: '652.5', translationType: 'sub' }),
        title: 'Chapter 652.5'
    },
    entry: {
        index: 0,
        size: 124_050,
        type: 'image/webp'
    }
}).AssertWebsite();

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
        id: JSON.stringify({ id: '261', translationType: 'raw' }),
        title: 'Chapter 261 Appeal for Aid [raw]'
    },
    entry: {
        index: 0,
        size: 381_378,
        type: 'image/jpeg'
    }
}).AssertWebsite();