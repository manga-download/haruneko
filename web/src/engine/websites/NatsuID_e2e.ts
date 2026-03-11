import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'natsuid',
        title: 'NatsuID'
    },
    container: {
        url: 'https://natsu.tv/manga/spare-me-great-lord/',
        id: '/manga/spare-me-great-lord/',
        title: 'Spare Me, Great Lord!'
    },
    child: {
        id: '/manga/spare-me-great-lord/chapter-705.120694/',
        title: 'Chapter 705'
    },
    entry: {
        index: 0,
        size: 25_156,
        type: 'image/webp'
    }
}).AssertWebsite();