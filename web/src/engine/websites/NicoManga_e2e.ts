import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nicomanga',
        title: 'NicoManga',
    },
    container: {
        url: 'https://nicomanga.com/manga-kage-no-jitsuryokusha-ni-naritakute-raw.html',
        id: '/manga-kage-no-jitsuryokusha-ni-naritakute-raw.html',
        title: 'To Be a Power in the Shadows!',
    },
    child: {
        id: '/read-kage-no-jitsuryokusha-ni-naritakute-raw-chapter-10.2.html',
        title: 'Chapter 10.2',
    },
    entry: {
        index: 0,
        size: 265_875,
        type: 'image/jpeg',
    }
}).AssertWebsite();