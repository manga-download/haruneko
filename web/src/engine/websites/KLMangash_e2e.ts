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
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/chapter-191/').toLowerCase(),
        title: '【第191話】'
    },
    entry: {
        index: 0,
        size: 117_354,
        type: 'image/webp'
    }
}).AssertWebsite();