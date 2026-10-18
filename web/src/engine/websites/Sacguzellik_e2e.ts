import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sacguzellik',
        title: 'Saç Güzellik'
    },
    container: {
        url: 'https://www.sacguzellik.com/seri-oku/genc-kilic-savascisi/',
        id: JSON.stringify({ post: '80', slug: '/seri-oku/genc-kilic-savascisi/' }),
        title: `Genç Kılıç Savaşçısı`
    },
    child: {
        id: '/seri-oku/genc-kilic-savascisi/bolum-41/',
        title: 'Bölüm 41'
    }, /* Login required: {
    entry: {
        index: 0,
        size: 52_384,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();