import { TestFixture } from '../../../test/WebsitesFixture';

// Case : Chapter link
new TestFixture({
    plugin: {
        id: 'mangaonejp',
        title: 'Manga One (Japan)',
    },
    container: {
        url: 'https://manga-one.com/manga/2169/chapter/291703',
        id: '2169',
        title: 'ホタルの嫁入り',
    },
    child: {
        id: JSON.stringify({ id: 291703, type: 'chapter' }),
        title: '8巻コミックPR'
    },
    entry: {
        index: 0,
        size: 81_222,
        type: 'image/webp'
    }
}).AssertWebsite();

// Case : Volume link
new TestFixture({
    plugin: {
        id: 'mangaonejp',
        title: 'Manga One (Japan)',
    },
    container: {
        url: 'https://manga-one.com/manga/2169/volume/3569',
        id: '2169',
        title: 'ホタルの嫁入り'
    },
    child: {
        id: JSON.stringify({ id: 3569, type: 'volume' }),
        title: '1巻'
    },
    entry: {
        index: 0,
        size: 24_058,
        type: 'image/webp'
    }
}).AssertWebsite();