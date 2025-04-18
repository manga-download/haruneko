import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shojoverse',
        title: 'Shojoverse'
    },
    container: {
        url: 'https://mythicscans.com/series/the-player-hides-his-past/',
        id: '/series/the-player-hides-his-past/',
        title: 'The Player Hides His Past',
    },
    child: {
        id: '/the-player-hides-his-past-chapter-64/',
        title: 'Chapter 64'
    },
    entry: {
        index: 1,
        size: 899_204,
        type: 'image/jpeg'
    }
}).AssertWebsite();