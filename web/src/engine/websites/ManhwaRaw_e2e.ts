import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwaraw',
        title: 'Manhwa Raw'
    },
    container: {
        url: 'https://manhwaraw.com/manhwa-raw/spirit-possession/',
        id: JSON.stringify({ post: '11592', slug: '/manhwa-raw/spirit-possession/' }),
        title: 'Spirit Possession'
    },
    child: {
        id: '/manhwa-raw/spirit-possession/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 2,
        size: 55_472,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());