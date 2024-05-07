import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwaworld',
        title: 'Manhwa World',
        timeout: 50000

    },
    container: {
        url: 'https://manhwaworld.com/manga/hero-killer-008/',
        id: JSON.stringify({ post: '249507', slug: '/manga/hero-killer-008/' }),
        title: 'Hero Killer'
    },
    child: {
        id: '/manga/hero-killer-008/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 835_613,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());