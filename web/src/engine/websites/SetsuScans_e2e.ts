import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'setsuscans',
        title: 'SetsuScans'
    },
    container: {
        url: 'https://manga.saytsu.com/manga/the-story-of-a-scary-consignee-girl',
        id: 'the-story-of-a-scary-consignee-girl',
        title: 'The Story of a Scary Consignee Girl'
    },
    child: {
        id: 'chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_712_149,
        type: 'image/jpeg'
    }
}).AssertWebsite();