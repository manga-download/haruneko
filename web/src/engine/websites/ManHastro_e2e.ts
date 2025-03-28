import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhastro',
        title: 'ManHastro'
    },
    container: {
        url: 'https://manhastro.com/lermanga/yohan-loves-tite/',
        id: JSON.stringify({ post: '47401', slug: '/lermanga/yohan-loves-tite/'}),
        title: 'Yohan Loves Tite'
    },
    child: {
        id: '/lermanga/yohan-loves-tite/capitulo-27/',
        title: 'Capitulo 27'
    },
    entry: {
        index: 3,
        size: 67_839,
        type: 'image/avif'
    }
}).AssertWebsite();