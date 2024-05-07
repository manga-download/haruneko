import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tempestscans',
        title: 'Tempest Scans'
    },
    container: {
        url: 'https://tempestscans.com/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-3047/',
        title: 'Bölüm: 3047'
    },
    entry: {
        index: 1,
        size: 392_392,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());