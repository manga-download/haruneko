import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yanmaga',
        title: 'Yanmaga'
    },
    container: {
        url: 'https://yanmaga.jp/comics/夢うつつの花の園',
        id: encodeURI('/comics/夢うつつの花の園'),
        title: '夢うつつの花の園',
    },
    child: {
        id: encodeURI('/comics/夢うつつの花の園/351192c0f7d1cf3b88175f3d9dfae594'),
        title: '第１夢　幽体離脱'
    },
    entry: {
        index: 0,
        size: 2_275_652,
        type: 'image/png'
    }
}).AssertWebsite();