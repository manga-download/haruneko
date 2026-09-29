import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Translated (English)
new TestFixture({
    plugin: {
        id: 'allmanga',
        title: 'AllManga'
    },
    container: {
        url: 'https://mkissa.to/manga/kFvrdRcbubPjrhr63',
        id: 'kFvrdRcbubPjrhr63',
        title: 'Dragon Prince Yuan'
    },
    child: {
        id: JSON.stringify({ chapterString: '652.5', translationType: 'sub' }),
        title: 'Chapter 652.5',
        timeout: 15_000
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
        id: JSON.stringify({ chapterString: '111', translationType: 'raw' }),
        title: 'Chapter 111 - Opening The Qi Dwelling (First Half) [raw]',
        timeout: 15_000
    },
    entry: {
        index: 0,
        size: 538_520,
        type: 'image/jpeg'
    }
}).AssertWebsite();