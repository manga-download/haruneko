import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'daycomics',
        title: 'DayComics'
    },
    container: {
        url: 'https://daycomics.com/content/101023',
        id: '/content/101023',
        title: 'Sex Study Group'
    },
    child: {
        id: '/content/101023/113522',
        title: 'Episode 1: Why is she in my house?'
    }, /* Content is now behind login
    entry: {
        index: 0,
        size: 356_854,
        type: 'image/webp'
    }*/
}).AssertWebsite();