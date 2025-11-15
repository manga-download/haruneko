import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'linewebtoon-translate',
        title: 'Line Webtoon (Translate)',
    },
    container: {
        url: 'https://translate.webtoons.com/webtoonVersion?webtoonNo=229&language=SWE&teamVersion=0',
        id: '/webtoonVersion?webtoonNo=229&language=SWE&teamVersion=0',
        title: 'Dr. Frost',
    },
    child: {
        id: '/viewer?webtoonNo=229&episodeNo=1&language=SWE&teamVersion=0',
        title: 'Ep. 0 - Prologue',
    },
    entry: {
        index: 0,
        size: 2_115_971,
        type: 'image/png',
    }
}).AssertWebsite();