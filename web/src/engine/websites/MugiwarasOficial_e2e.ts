import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mugiwarasoficial',
        title: 'Mugiwaras Oficial'
    },
    container: {
        url: 'https://mugiwarasoficial.com/manga/tengoku-daimakyou/',
        id: JSON.stringify({ post: '170', slug: '/manga/tengoku-daimakyou/' }),
        title: 'Tengoku Daimakyou'
    },
    child: {
        id: '/manga/tengoku-daimakyou/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 3,
        size: 299_817,
        type: 'image/avif'
    }
}).AssertWebsite();