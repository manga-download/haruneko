import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'MerlinToon'
    },
    container: {
        url: 'https://merlintoon.com/seri/akademinin-dehasi/',
        id: '/seri/akademinin-dehasi/',
        title: 'Akademinin Dehası',
        timeout: 10_000
    },
    child: {
        id: '/seri/akademinin-dehasi/bolum-65/',
        title: 'Bölüm 65',
        timeout: 10_000
    },
    entry: {
        index: 1,
        size: 553_600,
        type: 'image/webp'
    }
}).AssertWebsite();