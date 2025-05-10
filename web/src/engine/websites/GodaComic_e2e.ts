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
        id: './chapter/getcontent?m=2&c=47828',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 246_006,
        type: 'image/webp'
    }
}).AssertWebsite();