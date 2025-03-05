import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwa18-int',
        title: 'Manhwa 18 (.net)',
    },
    container: {
        url: 'https://manhwa18.net/manga/may-i-help-you',
        id: '/manga/may-i-help-you',
        title: 'May I Help You?',
    },
    child: {
        id: '/manga/may-i-help-you/chap-01-677',
        title: 'chap 01',
    },
    entry: {
        index: 0,
        size: 476_512,
        type: 'image/jpeg',
    }
}).AssertWebsite();