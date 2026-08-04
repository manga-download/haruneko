import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toontop',
        title: 'ToonTop'
    },
    container: {
        url: 'https://toontop.io/heart-of-a-dragon',
        id: 'KY5LRl89',
        title: 'Heart of a Dragon'
    },
    child: {
        id: 'LDgAzbx8',
        title: 'Chapter 17.5'
    },
    entry: {
        index: 1,
        size: 88_166,
        type: 'image/webp'
    }
}).AssertWebsite();