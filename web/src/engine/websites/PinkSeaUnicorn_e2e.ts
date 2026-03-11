import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'pinkseaunicorn',
        title: 'Pink Sea Unicorn'
    }, /* Website's password protected, remove it ?
    container: {
        url: 'https://psunicorn.com/manga/omega-complex/',
        id: JSON.stringify({ post: '1858', slug: '/manga/omega-complex/' }),
        title: 'Omega Complex'
    },
    child: {
        id: '/manga/omega-complex/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 2,
        size: 1_030_059,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();