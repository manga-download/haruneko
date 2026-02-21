import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'luvyaa',
        title: 'Luvyaa'
    },
    container: {
        url: 'https://luvyaa.id/todays-han-yoil-is-a-woman/',
        id: '/todays-han-yoil-is-a-woman/',
        title: `Today’s Han Yoil is a Woman`
    },
    child: {
        id: '/todays-han-yoil-is-a-woman-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 860_062,
        type: 'image/webp'
    }
}).AssertWebsite();