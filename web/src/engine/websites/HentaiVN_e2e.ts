import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hentaivn',
        title: 'HentaiVN'
    },
    container: {
        url: 'https://hentaivn.now/truyen-hentai/dong-ho-ngung-dong-thoi-gian/',
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
};

new TestFixture(config).AssertWebsite();