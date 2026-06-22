import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'godacomic',
        title: 'GodaComic',
    },
    container: {
        url: 'https://manhuascans.org/manga/00-kage-no-jitsuryokusha-ni-naritakute',
        id: '/manga/00-kage-no-jitsuryokusha-ni-naritakute',
        title: 'Kage no Jitsuryokusha ni Naritakute'
    },
    child: {
        id: '/manga/00-kage-no-jitsuryokusha-ni-naritakute/19045_1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 246_006,
        type: 'image/webp'
    }
}).AssertWebsite();