import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmangash',
        title: 'KLManga(.sh)'
    },
    container: {
        url: 'https://klmanga.works/manga-raw/ボールパークでつかまえて！-raw-free/',
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/'),
        title: 'ボールパークでつかまえて！'
    },
    child: {
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/chapter-224/').toLowerCase(),
        title: '【第224話】'
    },
    entry: {
        index: 0,
        size: 225_414,
        type: 'image/webp'
    }
}).AssertWebsite();