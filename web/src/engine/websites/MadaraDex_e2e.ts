import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'madaradex',
        title: 'MadaraDex'
    },
    container: {
        url: 'https://madaradex.org/title/eleceed/',
        id: JSON.stringify({ post: '942', slug: '/title/eleceed/' }),
        title: 'Eleceed'
    },
    child: {
        id: '/title/eleceed/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 87_884,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());