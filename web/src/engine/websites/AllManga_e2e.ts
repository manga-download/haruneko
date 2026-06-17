import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Translated (English)
new TestFixture({
    plugin: {
        id: 'allmanga',
        title: 'AllManga'
    },
    container: {
        url: 'https://allmanga.to/manga/kFvrdRcbubPjrhr63',
        id: 'kFvrdRcbubPjrhr63',
        title: 'Dragon Prince Yuan'
    },
    child: {
        id: JSON.stringify({ chapterString: '652.5', translationType: 'sub' }),
        title: 'Chapter 652.5'
    },
    entry: {
        index: 0,
        size: 124_050,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE : RAW (Chinese)
new TestFixture({
    plugin: {
        id: 'allmanga',
        title: 'AllManga'
    },
    container: {
        url: 'https://allmanga.to/manga/kFvrdRcbubPjrhr63',
        id: 'kFvrdRcbubPjrhr63',
        title: 'Dragon Prince Yuan'
    },
    child: {
        id: JSON.stringify({ chapterString: '261', translationType: 'raw' }),
        title: 'Chapter 261 - Appeal for Aid [raw]'
    },
    entry: {
        index: 0,
        size: 385_022,
        type: 'image/jpeg'
    }
}).AssertWebsite();