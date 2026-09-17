import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-th',
        title: 'MangaToon (Thai)',
    },
    container: {
        url: 'https://mangatoon.mobi/th/เซียนจุนเป็นลูกเขย?content_id=2362832',
        id: '2362832',
        title: 'เซียนจุนเป็นลูกเขย'
    },
    child: {
        id: '43144',
        title: 'ตอนที่ 1'
    },
    entry: {
        index: 5,
        size: 50_934,
        type: 'image/webp'
    }
}).AssertWebsite();