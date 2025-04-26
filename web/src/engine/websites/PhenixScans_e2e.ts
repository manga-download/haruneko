import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'phenixscans',
        title: 'Phenix Scans'
    },
    container: {
        url: 'https://phenix-scans.com/manga/infinite-mage',
        id: '/manga/infinite-mage',
        title: 'Infinite Mage'
    },
    child: {
        id: '/manga/infinite-mage/chapitre/60',
        title: 'Chapitre 60'
    },
    entry: {
        index: 0,
        size: 1_217_836,
        type: 'image/jpeg'
    }
}).AssertWebsite();