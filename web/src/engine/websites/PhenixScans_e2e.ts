import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'phenixscans',
        title: 'Phenix Scans'
    },
    container: {
        url: 'https://phenix-scans.co/manga/infinite-mage',
        id: '/manga/infinite-mage',
        title: 'Infinite Mage'
    },
    child: {
        id: '/manga/infinite-mage/chapitre/60',
        title: 'Chapitre 60'
    },
    entry: {
        index: 3,
        size: 767_128,
        type: 'image/jpeg'
    }
}).AssertWebsite();