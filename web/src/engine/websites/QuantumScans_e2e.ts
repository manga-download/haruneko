import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'quantumscans',
        title: 'Quantum Scans'
    },
    container: {
        url: 'https://qscomics.org/series/master-of-the-martial-arts-library/',
        id: '/series/master-of-the-martial-arts-library/',
        title: 'Master of the Martial Arts Library'
    },
    child: {
        id: '/master-of-the-martial-arts-library-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 2_670_186,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());