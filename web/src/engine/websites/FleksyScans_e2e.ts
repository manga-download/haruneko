import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fleksyscans',
        title: 'Fleksy Scans'
    },
    container: {
        url: 'https://flexscans.com/manga/troublesome-sister',
        id: '/manga/troublesome-sister',
        title: 'Troublesome Sister'
    },
    child: {
        id: '/manga/troublesome-sister/95',
        title: 'Chapter 95'
    },
    entry: {
        index: 0,
        size: 715_450,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());