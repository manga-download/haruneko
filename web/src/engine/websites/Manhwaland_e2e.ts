import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwaland',
        title: 'Manhwaland'
    },
    container: {
        url: 'https://manhwaland.host/manga/got-a-room-uncensored/',
        id: '/manga/got-a-room-uncensored/',
        title: 'Got a Room? UNCENSORED'
    },
    child: {
        id: '/got-a-room-uncensored-chapter-1-1/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 0,
        size: 143_057,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();