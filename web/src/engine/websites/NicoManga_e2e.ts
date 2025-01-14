import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nicomanga',
        title: 'NicoManga'
    },
    container: {
        url: 'https://nicomanga.com/manga-kage-no-jitsuryokusha-ni-naritakute-raw.html',
        id: '/manga-kage-no-jitsuryokusha-ni-naritakute-raw.html',
        title: 'TO BE A POWER IN THE SHADOWS!'
    },
    child: {
        id: '/read-kage-no-jitsuryokusha-ni-naritakute-raw-chapter-60.2.html',
        title: 'Chapter 60.2',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 708_342,
        type: 'image/jpeg'
    }
}).AssertWebsite();