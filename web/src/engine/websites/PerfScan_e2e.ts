import { TestFixture } from '../../../test/WebsitesFixture';

const ComicConfig = {
    plugin: {
        id: 'perfscan',
        title: 'Perf Scan'
    },
    container: {
        url: 'https://perf-scan.fr/series/martial-peak',
        id: JSON.stringify({ id: '1', slug: 'martial-peak' }),
        title: 'Martial Peak'
    },
    child: {
        id: JSON.stringify({ id: '28768', slug: 'chapitre-1298' }),
        title: 'Chapitre 1298'
    },
    entry: {
        index: 2,
        size: 939_807,
        type: 'image/jpg'
    }
};

const ComicFixture = new TestFixture(ComicConfig);
describe(ComicFixture.Name, () => ComicFixture.AssertWebsite());

const NovelConfig = {
    plugin: {
        id: 'perfscan',
        title: 'Perf Scan'
    },
    container: {
        url: 'https://perf-scan.fr/series/demonic-emperor-novel',
        id: JSON.stringify({ id: '17', slug: 'demonic-emperor-novel' }),
        title: 'Demonic emperor - Novel'
    },
    child: {
        id: JSON.stringify({ id: '28668', slug: 'chapitre-492' }),
        title: 'Chapitre 492'
    },
    entry: {
        index: 0,
        size: 789_130,
        type: 'image/png'
    }
};

const NovelFixture = new TestFixture(NovelConfig);
describe(NovelFixture.Name, () => NovelFixture.AssertWebsite());
