import { describe } from 'vitest';
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
describe(ComicFixture.Name, async () => (await ComicFixture.Connect()).AssertWebsite());
