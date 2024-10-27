import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'turkcemangaoku',
        title: 'Türkçe Manga Oku'
    },
    container: {
        url: 'https://trmangaoku.com/manga/gel-beni-al/',
        id: JSON.stringify({ post: '1253', slug: '/manga/gel-beni-al/'}),
        title: 'Gel Beni Al!'
    },
    child: {
        id: '/manga/gel-beni-al/bolum-117/',
        title: 'Bölüm 117'
    },
    entry: {
        index: 0,
        size: 556_204,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();