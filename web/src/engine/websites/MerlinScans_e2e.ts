import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'MerlinToon'
    },
    container: {
        url: 'https://merlintoon.com/seri/akademinin-dehasi/',
        id: '/seri/akademinin-dehasi/',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '/seri/akademinin-dehasi/bolum-65/',
        title: 'Bölüm 65'
    },
    entry: {
        index: 0,
        size: 553_600,
        type: 'image/webp'
    }
}).AssertWebsite();