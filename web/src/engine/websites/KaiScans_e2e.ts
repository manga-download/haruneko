import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kaiscans',
        title: 'Kai Scans'
    },
    container: {
        url: 'https://umiscans.org/manga/4399247773-my-in-laws-are-obsessed-with-me/',
        id: '/manga/4399247773-my-in-laws-are-obsessed-with-me/',
        title: 'My In-Laws Are Obsessed With Me'
    },
    child: {
        id: '/2185285408-my-in-laws-are-obsessed-with-me-96/',
        title: 'Chapter 96'
    },
    entry: {
        index: 1,
        size: 720_727,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());