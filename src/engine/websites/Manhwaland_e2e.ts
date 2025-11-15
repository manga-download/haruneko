import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'manhwaland',
        title: 'Manhwaland'
    },
    container: {
        url: 'https://02.manhwaland.land/manga/got-a-room-uncensored/',
        id: '/manga/got-a-room-uncensored/',
        title: 'Got a Room? UNCENSORED'
    },
    child: {
        id: '/got-a-room-uncensored-chapter-1-1/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 1,
        size: 480_076,
        type: 'image/jpeg'
    }
}).AssertWebsite();