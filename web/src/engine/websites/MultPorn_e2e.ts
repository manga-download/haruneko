import { TestFixture } from '../../../test/WebsitesFixture';

// user paste a "manga" link
new TestFixture({
    plugin: {
        id: 'multporn',
        title: 'MultPorn'
    },
    container: {
        url: 'https://multporn.net/hentai_manga/azur_lane',
        id: '/hentai_manga/azur_lane',
        title: 'Azur Lane',
        timeout: 15000
    },
    child: {
        id: '/hentai_manga/a_maids_duty',
        title: `A Maid's Duty`
    },
    entry: {
        index: 1,
        size: 619_504,
        type: 'image/png'
    }
}).AssertWebsite();

// user directly paste a "chapter" link
new TestFixture({
    plugin: {
        id: 'multporn',
        title: 'MultPorn'
    },
    container: {
        url: 'https://multporn.net/hentai_manga/a_maids_duty',
        id: '/hentai_manga/azur_lane',
        title: 'Azur Lane',
        timeout: 15000
    },
    child: {
        id: '/hentai_manga/a_maids_duty',
        title: `A Maid's Duty`
    },
    entry: {
        index: 1,
        size: 619_504,
        type: 'image/png'
    }
}).AssertWebsite();