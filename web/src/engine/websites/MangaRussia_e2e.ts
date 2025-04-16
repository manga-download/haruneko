import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangarussia',
        title: 'MangaRussia'
    },
    container: {
        url: 'https://www.mangarussia.com/manga/Невеста+чародея.html',
        id: encodeURI('/manga/Невеста+чародея.html'),
        title: 'Невеста чародея',
    },
    child: {
        id: encodeURI('/chapter/Глава+v13+-+65/1927199/'),
        title: 'Глава v13 - 65',
    },
    entry: {
        index: 0,
        size: 546_648,
        type: 'image/jpeg'
    }
}).AssertWebsite();