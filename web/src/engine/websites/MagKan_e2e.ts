import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        id: '/episodes/93e16b054f108/',
        title: '第零話'
    },
    entry: {
        index: 1,
        size: 3_166_820,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();