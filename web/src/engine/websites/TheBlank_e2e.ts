import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'theblank',
        title: 'TheBlank',
        timeout: 180_000
    },
    container: {
        url: 'https://theblank.net/serie/sneak-a-peek',
        id: '/serie/sneak-a-peek',
        title: 'Sneak a Peek',
        timeout: 180_000
    },
    child: {
        id: '/serie/sneak-a-peek/chapter/xtmJIsPv0mGt-chapter-1',
        title: 'Chapter 1',
        timeout: 180_000
    },
    entry: {
        index: 0,
        size: 124_662,
        type: 'image/jpeg',
        timeout: 180_000
    }
}).AssertWebsite();
