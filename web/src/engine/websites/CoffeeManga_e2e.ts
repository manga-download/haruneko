import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'coffeemanga',
        title: 'CoffeeManga'
    },
    container: {
        url: 'https://coffeemanga.io/manga/savage-castle/',
        id: JSON.stringify({ post: '23019', slug: '/manga/savage-castle/' }),
        title: 'Savage Castle'
    },
    child: {
        id: '/manga/savage-castle/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 119_934,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());