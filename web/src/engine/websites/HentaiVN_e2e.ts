import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaivn',
        title: 'HentaiVN'
    },
    container: {
        url: 'https://hentaivn.men/truyen-hentai/dong-ho-ngung-dong-thoi-gian/',
        id: JSON.stringify({ post: '10351', slug: '/truyen-hentai/dong-ho-ngung-dong-thoi-gian/'}),
        title: 'Đồng Hồ Ngưng Đọng Thời Gian'
    },
    child: {
        id: '/truyen-hentai/dong-ho-ngung-dong-thoi-gian/dong-ho-ngung-dong-thoi-gian-chapter-86/',
        title: 'Chapter 86'
    },
    entry: {
        index: 1,
        size: 589_281,
        type: 'image/jpeg'
    }
}).AssertWebsite();