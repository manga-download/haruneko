import { TestFixture } from '../../../test/WebsitesFixture';

// Case : Chapter link
new TestFixture({
    plugin: {
        id: 'mangaonejp',
        title: 'Manga One (Japan)',
    },
    container: {
        url: 'https://manga-one.com/viewer/289669',
        id: '2169',
        title: 'ホタルの嫁入り',
    },
    child: {
        id: JSON.stringify({ id: 289669, type: 'chapter' }),
        title: '第62話 子供の育て方'
    },
    entry: {
        index: 0,
        size: 117_492,
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
        url: 'https://manga-one.com/viewer/3569?viewer_type=volume&is_trial=true&type=volume&sort_type=desc&page=1&limit=10',
        id: '2169',
        title: 'ホタルの嫁入り'
    },
    child: {
        id: JSON.stringify({ id: 3569, type: 'volume' }),
        title: '1巻'
    },
    entry: {
        index: 0,
        size: 313_823,
        type: 'image/jpeg'
    }
}).AssertWebsite();