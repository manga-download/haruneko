import { TestFixture } from '../../../test/WebsitesFixture';

// user paste a "manga" link (a category)
new TestFixture({
    plugin: {
        id: 'multporn',
        title: 'MultPorn'
    },
    container: {
        url: 'https://multporn.com/manga/azur_lane',
        id: '/manga/azur_lane',
        title: 'Azur Lane',
    },
    child: {
        id: '/hentai_manga/a_maids_duty',
        title: `A Maid's Duty`
    },
    entry: {
        index: 1,
        size: 526_291,
        type: 'image/png'
    }
}).AssertWebsite();

// user directly paste a "chapter" link (a 'manga')
new TestFixture({
    plugin: {
        id: 'multporn',
        title: 'MultPorn'
    },
    container: {
        url: 'https://multporn.com/hentai_manga/a_maids_duty',
        id: '/manga/azur_lane',
        title: 'Azur Lane',
    },
    child: {
        id: '/hentai_manga/a_maids_duty',
        title: `A Maid's Duty`
    },
    entry: {
        index: 1,
        size: 526_291,
        type: 'image/png'
    }
}).AssertWebsite();