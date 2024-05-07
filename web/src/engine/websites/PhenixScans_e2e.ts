import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'phenixscans',
        title: 'Phenix Scans'
    },
    container: {
        url: 'https://phenixscans.fr/manga/infinite-mage/',
        id: '/manga/infinite-mage/',
        title: 'Infinite Mage'
    },
    child: {
        id: '/infinite-mage-chapitre-60/',
        title: 'Chapitre 60'
    },
    entry: {
        index: 0,
        size: 1_217_836,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());