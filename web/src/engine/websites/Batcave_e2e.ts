import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'batcave',
        title: 'Batcave',
        timeout: 30_000
    },
    /* Unless we use a mobile UA, everything is behind login
    container: {
        url: 'https://batcave.biz/2752-house-of-x/powers-of-x.html',
        id: '/2752-house-of-x/powers-of-x.html',
        title: 'House Of X/Powers Of X (2019)'
    },
    child: {
        id: '/reader/2752/14209',
        title: '#1'
    },
    entry: {
        index: 0,
        size: 298_186,
        type: 'image/webp'
    }*/
}).AssertWebsite();