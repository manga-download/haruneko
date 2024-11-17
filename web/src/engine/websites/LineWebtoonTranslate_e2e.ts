import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'linewebtoon-translate',
        title: 'Line Webtoon (Translate)',
    },
    container: {
        url: 'https://translate.webtoons.com/webtoonVersion?webtoonNo=3140&language=SWE&teamVersion=0',
        id: '/webtoonVersion?webtoonNo=3140&language=SWE&teamVersion=0',
        title: 'I want to be a cute anime girl',
        timeout: 20000
    },
    child: {
        id: '/viewer?webtoonNo=3140&episodeNo=133&language=SWE&teamVersion=0',
        title: '130 - A great deal',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 869_052,
        type: 'image/png',
    }
};

new TestFixture(config).AssertWebsite();