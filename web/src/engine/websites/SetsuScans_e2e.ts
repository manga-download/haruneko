import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'setsuscans',
        title: 'SetsuScans'
    },
    container: {
        url: 'https://setsuscans.com/manga/the-story-of-this-scary-consignee-girl/',
        id: JSON.stringify({ post: '163', slug: '/manga/the-story-of-this-scary-consignee-girl/' }),
        title: 'The Story of this Scary Consignee Girl'
    },
    child: {
        id: '/manga/the-story-of-this-scary-consignee-girl/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 819_373,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());