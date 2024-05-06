import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'novelmic',
        title: 'NovelMic'
    },
    container: {
        url: 'https://novelmic.com/comic/i-picked-up-an-attribute-hot-free-comics/',
        id: JSON.stringify({ post: '3132', slug: '/comic/i-picked-up-an-attribute-hot-free-comics/' }),
        title: 'I Picked Up An Attribute'
    },
    child: {
        id: '/comic/i-picked-up-an-attribute-hot-free-comics/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 61_252,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());