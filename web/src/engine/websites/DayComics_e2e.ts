import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
    },
    entry: {
        index: 0,
        size: 356_854,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();