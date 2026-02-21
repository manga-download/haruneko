import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'poseidonscans',
        title: 'Poseidon Scans'
    },
    container: {
        url: 'https://poseidon-scans.co/serie/regression-of-the-close-combat-mage',
        id: 'regression-of-the-close-combat-mage',
        title: 'Regression of the Close Combat Mage'
    },
    child: {
        id: '/serie/regression-of-the-close-combat-mage/chapter/38',
        title: 'Chapitre 38'
    },
    entry: {
        index: 0,
        size: 190_488,
        type: 'image/webp'
    }
}).AssertWebsite();