import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhastro',
        title: 'ManHastro'
    },
    container: {
        url: 'https://manhastro.net/lermanga/yohan-loves-tite/',
        id: JSON.stringify({ post: '47401', slug: '/lermanga/yohan-loves-tite/'}),
        title: 'Yohan Loves Tite'
    },
    child: {
        id: '/lermanga/yohan-loves-tite/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 2,
        size: 5_026,
        type: 'image/avif'
    }
}).AssertWebsite();