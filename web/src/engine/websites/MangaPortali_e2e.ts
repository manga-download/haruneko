import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaportali',
        title: 'Manga Portalı',
    },
    container: {
        url: 'https://www.mangaportali.com/series/solo-leveling',
        id: '/series/solo-leveling',
        title: 'Solo Leveling',
    },
    child: {
        id: '/reader/solo-leveling/bolum-1',
        title: 'Bölüm 1',
    },
    entry: {
        index: 0,
        size: 47_684,
        type: 'image/webp',
    },
}).AssertWebsite();
