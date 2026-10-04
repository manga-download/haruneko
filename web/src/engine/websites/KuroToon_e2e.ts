import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kurotoon',
        title: 'KuroToon'
    },
    container: {
        url: 'https://kurotoon.com/comic/the-heavenly-demon-cant-live-a-normal-life-มารสวรร',
        id: encodeURI('the-heavenly-demon-cant-live-a-normal-life-มารสวรร'),
        title: 'The Heavenly Demon Can’t Live a Normal Life มารสวรรค์จะมีชีวิตธรรมดาไม่ได้หรอก'
    },
    child: {
        id: '/read/the-heavenly-demon-cant-live-a-normal-life-มารสวรร-chapter-209/',
        title: 'ตอนที่ 209'
    },
    entry: {
        index: 0,
        size: 83_600,
        type: 'image/webp'
    }
}).AssertWebsite();