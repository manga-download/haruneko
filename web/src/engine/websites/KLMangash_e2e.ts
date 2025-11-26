import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmangash',
        title: 'KLManga(.sh)'
    },
    container: {
        url: 'https://klmanga.pl/manga-raw/ボールパークでつかまえて！-raw-free/',
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/'),
        title: 'ボールパークでつかまえて！'
    },
    child: {
        id: encodeURI('/manga-raw/ボールパークでつかまえて！-raw-free/chapter-193/').toLowerCase(),
        title: '【第193話】'
    },
    entry: {
        index: 11,
        size: 244_768,
        type: 'image/webp'
    }
}).AssertWebsite();