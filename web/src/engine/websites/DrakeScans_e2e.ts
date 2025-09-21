import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'drakescans',
        title: 'Drake Scans'
    },
    container: {
        url: 'https://drakecomic.org/manga/idle-player-returns-as-a-god/',
        id: '/manga/idle-player-returns-as-a-god/',
        title: 'Idle Player Returns as a God'
    },
    child: {
        id: '/idle-player-returns-as-a-god-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 701_367,
        type: 'image/jpeg'
    }
}).AssertWebsite();