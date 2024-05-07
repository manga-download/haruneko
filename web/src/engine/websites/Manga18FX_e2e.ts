import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga18fx',
        title: 'Manga18fx'
    },
    container: {
        url: 'https://manga18fx.com/manga/omniscient-readers-viewpoint-01',
        id: JSON.stringify({ slug: '/manga/omniscient-readers-viewpoint-01' }),
        title: 'Omniscient Reader\'s Viewpoint'
    },
    child: {
        id: '/manga/omniscient-readers-viewpoint-01/chapter-0',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 64_176,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());