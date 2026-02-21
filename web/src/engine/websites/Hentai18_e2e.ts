import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentai18',
        title: 'Hentai18'
    },
    container: {
        url: 'https://hentai18.net/read-hentai/knock-knock-uncensored',
        id: '/read-hentai/knock-knock-uncensored',
        title: 'Knock Knock (Uncensored)'
    },
    child: {
        id: '/read-hentai/knock-knock-uncensored-chapter-43-ch121877',
        title: 'Chapter 43'
    },
    entry: {
        index: 6,
        size: 629_278,
        type: 'image/jpeg'
    }
}).AssertWebsite();