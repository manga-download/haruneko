import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

//user  paste a "manga" link
const configManga = {
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
};

const fixtureManga = new TestFixture(configManga);
describe(fixtureManga.Name, async () => (await fixtureManga.Connect()).AssertWebsite());

//user directly paste a "chapter" link
const configChapter = {
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
};

const fixtureChapter = new TestFixture(configChapter);
describe(fixtureChapter.Name, async () => (await fixtureChapter.Connect()).AssertWebsite());