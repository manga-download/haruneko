import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwaclan',
        title: 'Manhwaclan'
    },
    container: {
        url: 'https://manhwaclan.com/manga/frozen-apocalypse-no-chance-of-survival/',
        id: JSON.stringify({ post: '13106', slug: '/manga/frozen-apocalypse-no-chance-of-survival/' }),
        title: 'Frozen Apocalypse: No Chance of Survival'
    },
    child: {
        id: '/manga/frozen-apocalypse-no-chance-of-survival/chapter-15/',
        title: 'Chapter 15'
    },
    entry: {
        index: 1,
        size: 321_198,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());