import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'qmanga',
        title: 'QManga'
    },
    container: {
        url: 'https://qmanga.art/truyen-tranh/dong-ho-ngung-dong-thoi-gian/',
        id: JSON.stringify({ post: '9126', slug: '/truyen-tranh/dong-ho-ngung-dong-thoi-gian/' }),
        title: 'Đồng Hồ Ngưng Đọng Thời Gian'
    },
    child: {
        id: '/truyen-tranh/dong-ho-ngung-dong-thoi-gian/chapter-86/',
        title: 'Chapter 86'
    },
    entry: {
        index: 1,
        size: 398_788,
        type: 'image/jpeg'
    }
}).AssertWebsite();