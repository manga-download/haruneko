import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'luvyaa',
        title: 'Luvyaa'
    },
    container: {
        url: 'https://v2.luvyaa.co/todays-han-yoil-is-a-woman/',
        id: '/todays-han-yoil-is-a-woman/',
        title: `Today’s Han Yoil is a Woman`
    },
    child: {
        id: '/todays-han-yoil-is-a-woman-chapter-01/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 342_064,
        type: 'image/webp'
    }
}).AssertWebsite();