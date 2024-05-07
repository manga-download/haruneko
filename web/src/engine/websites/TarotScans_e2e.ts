import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tarotscans',
        title: 'Tarot Scans'
    },
    container: {
        url: 'https://www.tarotscans.com/manga/perspective-of-the-all-knowing-reader/',
        id: '/manga/perspective-of-the-all-knowing-reader/',
        title: 'Perspective of the All-Knowing Reader'
    },
    child: {
        id: '/perspective-of-the-all-knowing-reader-chapter-180/',
        title: 'Chapter 180'
    },
    entry: {
        index: 2,
        size: 362_058,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());