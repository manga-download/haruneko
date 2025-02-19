import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'perfscan',
        title: 'Perf Scan'
    },
    container: {
        url: 'https://perf-scan.fr/fr/series/006ccbce-6404-4654-85ea-ce15774bb276',
        id: '006ccbce-6404-4654-85ea-ce15774bb276',
        title: 'Traces of the Moon'
    },
    child: {
        id: '05a16fc1-044b-472e-b539-644c1f80700d',
        title: '1'
    },
    entry: {
        index: 1,
        size: 160_955,
        type: 'image/jpeg'
    }
}).AssertWebsite();