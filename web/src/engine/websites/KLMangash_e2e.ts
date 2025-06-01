import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmangash',
        title: 'KLManga(.sh)'
    },
    container: {
        url: 'https://klmanga.sh/manga-raw/ボールパークでつかまえて！-raw-free/',
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/'),
        title: 'ボールパークでつかまえて！'
    },
    child: {
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/chapter-190/').toLowerCase(),
        title: '【第190話】'
    },
    entry: {
        index: 11,
        size: 219_118,
        type: 'image/webp'
    }
}).AssertWebsite();