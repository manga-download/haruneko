import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mugiwarasoficial',
        title: 'Mugiwaras Oficial'
    },
    container: {
        url: 'https://mugiwarasoficial.org/manga/tengoku-daimakyou',
        id: '/manga/tengoku-daimakyou',
        title: 'Tengoku Daimakyou'
    },
    child: {
        id: '/manga/tengoku-daimakyou/ler/1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 10,
        size: 516_054,
        type: 'image/webp'
    }
}).AssertWebsite();