import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kuimh',
        title: '酷爱漫画 (Kuimh)'
    },
    container: {
        url: 'https://www.woimh.com/book/mh11666',
        id: '/book/mh11666',
        title: '上流社会',
    },
    child: {
        id: '/chapter/398580-3769728',
        title: '第01话',
    },
    entry: {
        index: 1,
        size: 53_440,
        type: 'image/jpeg'
    }
}).AssertWebsite();