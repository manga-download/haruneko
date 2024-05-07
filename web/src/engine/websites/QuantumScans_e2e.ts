import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'quantumscans',
        title: 'Quantum Scans'
    },
    container: {
        url: 'https://readers-point.space/series/master-of-the-martial-arts-library/',
        id: '/series/master-of-the-martial-arts-library/',
        title: 'Master of the Martial Arts Library'
    },
    child: {
        id: '/master-of-the-martial-arts-library-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 2_386_263,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());