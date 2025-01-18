import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'magkan',
        title: 'MagKan'
    },
    container: {
        url: 'https://kansai.mag-garden.co.jp/series/76efde6cc8881/',
        id: '/series/76efde6cc8881/',
        title: '推し変しやがれ!!'
    },
    child: {
        id: '/episodes/a742481ce1e89/',
        title: '第零話'
    },
    entry: {
        index: 1,
        size: 3_166_820,
        type: 'image/png',
        timeout: 10000
    }
}).AssertWebsite();