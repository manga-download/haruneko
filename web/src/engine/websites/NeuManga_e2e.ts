import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'neumanga',
        title: 'NeuManga'
    },
    container: {
        url: 'https://neumanga.id/manga/cultivation-return-on-campus',
        id: '/manga/cultivation-return-on-campus',
        title: 'Cultivation Return on Campus'
    },
    child: {
        id: '/manga/cultivation-return-on-campus/ch/439',
        title: 'Ch 439'
    },
    entry: {
        index: 0,
        size: 466_110,
        type: 'image/jpeg'
    }
}).AssertWebsite();