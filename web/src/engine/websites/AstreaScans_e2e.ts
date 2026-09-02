import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astreascans',
        title: 'Astrea Scans'
    },
    container: {
        url: 'https://astreascans.com/manga/tutsak-esim-bosanmak-istiyor/',
        id: '/manga/tutsak-esim-bosanmak-istiyor/',
        title: 'Tutsak Eşim Boşanmak İstiyor'
    },
    child: {
        id: '/manga/tutsak-esim-bosanmak-istiyor/bolum-1/',
        title: 'bölüm 1'
    },
    entry: {
        index: 0,
        size: 179_672,
        type: 'image/webp'
    }
}).AssertWebsite();