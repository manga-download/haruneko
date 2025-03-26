import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shojoverse',
        title: 'Shojoverse'
    },
    container: {
        url: 'https://mythicscans.net/manga/reality-quest/',
        id: '/manga/reality-quest/',
        title: 'Reality Quest',
    },
    child: {
        id: '/reality-quest-chapter-152/',
        title: 'Chapter 152'
    },
    entry: {
        index: 0,
        size: 311_196,
        type: 'image/jpeg'
    }
}).AssertWebsite();