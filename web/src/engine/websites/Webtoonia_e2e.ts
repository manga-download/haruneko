import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webtoonia',
        title: 'Webtoonia'
    },
    container: {
        url: 'https://webtoonia.fun/seri/kotu-adamin-saf-aski/',
        id: JSON.stringify({ post: '25', slug: '/seri/kotu-adamin-saf-aski/' }),
        title: 'Kötü Adamın Saf Aşkı'
    },
    child: {
        id: '/seri/kotu-adamin-saf-aski/bolum-24/',
        title: 'Bölüm 24'
    },
    entry: {
        index: 0,
        size: 948_823,
        type: 'image/jpeg'
    }
}).AssertWebsite();