import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikrealm',
        title: 'KomikRealm',
    },
    container: {
        url: 'https://komikrealm.org/manhwa/apocalypse-battle/',
        id: '/manhwa/apocalypse-battle/',
        title: 'Apocalypse Battle'
    },
    child: {
        id: '/manhwa/apocalypse-battle/chapter-12/',
        title: 'Chapter 12',
    },
    entry: {
        index: 1,
        size: 810_748,
        type: 'image/webp'
    }
}).AssertWebsite();