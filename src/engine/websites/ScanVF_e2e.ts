import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'scanvf',
        title: 'Scan VF',
    },
    container: {
        url: 'https://www.scan-vf.net/jujutsu-kaisen',
        id: '/jujutsu-kaisen',
        title: 'Jujutsu Kaisen',
    },
    child: {
        id: '/jujutsu-kaisen/chapitre-220',
        title: '220 : Auto-nettoyage et retenue',
    },
    entry: {
        index: 0,
        size: 375_015,
        type: 'image/png',
    }
}).AssertWebsite();