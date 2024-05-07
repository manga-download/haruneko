import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'constellarscans',
        title: 'Constellar Scans'
    },
    container: {
        url: 'https://constellarcomic.com/manga/secret-class/',
        id: '/manga/secret-class/',
        title: 'Secret Class'
    },
    child: {
        id: '/secret-class-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 1_161_942,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());