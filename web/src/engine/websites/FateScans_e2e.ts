import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'fatescans',
        title: 'Fate Scans'
    },
    container: {
        url: 'https://fatescans.com/manga/figuranin-nihai-rehberi/',
        id: '/manga/figuranin-nihai-rehberi/',
        title: 'Figüranın Nihai Rehberi'
    },
    child: {
        id: '/manga/figuranin-nihai-rehberi/bolum-5/',
        title: 'Bölüm 5'
    },
    entry: {
        index: 1,
        size: 1_445_452,
        type: 'image/webp'
    }
}).AssertWebsite();