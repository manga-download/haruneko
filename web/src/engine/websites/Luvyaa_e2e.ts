import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'luvyaa',
        title: 'Luvyaa'
    },
    container: {
        url: 'https://v4.luvyaa.co/todays-han-yoil-is-a-woman/',
        id: '/todays-han-yoil-is-a-woman/',
        title: `Today’s Han Yoil is a Woman`
    },
    child: {
        id: '/todays-han-yoil-is-a-woman-chapter-66/',
        title: 'Chapter 66',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 347_540,
        type: 'image/webp'
    }
}).AssertWebsite();