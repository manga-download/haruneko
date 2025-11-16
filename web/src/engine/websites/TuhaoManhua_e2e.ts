import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tuhaomanhua',
        title: 'TuhaoManhua',
    },
    container: {
        url: 'https://www.tuhaomanhua.org/manhua/enuqianjin.html',
        id: '/manhua/enuqianjin.html',
        title: '恶女千金'
    },
    child: {
        id: '/chapter_16443_440135.html',
        title: '第1章：'
    },
    entry: {
        index: 0,
        size: 126_329,
        type: 'image/jpeg'
    }
}).AssertWebsite();