import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shojoverse',
        title: 'KingOfManhwa'
    },
    container: {
        url: 'https://kingofmanhwa.com/manga/the-player-hides-his-past/',
        id: '/manga/the-player-hides-his-past/',
        title: 'The Player Hides His Past',
    },
    child: {
        id: '/the-player-hides-his-past-chapter-64/',
        title: 'Chapter 64'
    },
    entry: {
        index: 1,
        size: 1_191_678,
        type: 'image/jpeg'
    }
}).AssertWebsite();