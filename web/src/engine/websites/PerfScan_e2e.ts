import { TestFixture } from '../../../test/WebsitesFixture';

const ComicConfig = {
    plugin: {
        id: 'perfscan',
        title: 'Perf Scan'
    },
    container: {
        url: 'https://perf-scan.fr/series/martial-peak-1702249200756',
        id: 'martial-peak-1702249200756',
        title: 'Martial Peak'
    },
    child: {
        id: 'chapitre-1298',
        title: 'S6 Chapitre 1298'
    },
    entry: {
        index: 2,
        size: 215_840,
        type: 'image/webp'
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
        url: 'https://perf-scan.fr/series/demonic-emperor-novel-1702249200676',
        id: 'demonic-emperor-novel-1702249200676',
        title: 'Demonic emperor - Novel'
    },
    child: {
        id: 'chapitre-492',
        title: 'S4 Chapitre 492'
    },
    entry: {
        index: 0,
        size: 789_130,
        type: 'image/png'
    }
};

const NovelFixture = new TestFixture(NovelConfig);
describe(NovelFixture.Name, () => NovelFixture.AssertWebsite());