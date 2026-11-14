import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'MerlinToon'
    },
    container: {
        url: 'https://merlintoon.net/seri/akademinin-dehasi-b4d91c1a/',
        id: '/seri/akademinin-dehasi-b4d91c1a/',
        title: 'Akademinin Dehası',
        timeout: 15_000
    },
    child: {
        id: '/seri/akademinin-dehasi-b4d91c1a/bolum-65/',
        title: 'Bölüm 65',
        timeout: 15_000
    },
    entry: {
        index: 1,
        size: 81_150,
        type: 'image/webp'
    }
}).AssertWebsite();