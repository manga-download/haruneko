import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'soraraw',
        title: 'SoraRaw'
    },
    container: {
        url: 'https://soraraw.com/manga/rimootorabuhooru-52237',
        id: '/manga/rimootorabuhooru-52237',
        title: 'リモートラブホール'
    },
    child: {
        id: '/manga/rimootorabuhooru-52237/ch-93',
        title: '93'
    },
    entry: {
        index: 0,
        size: 159_028,
        type: 'image/webp'
    }
}).AssertWebsite();