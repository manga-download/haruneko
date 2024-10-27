import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhdammy',
        title: 'Truyện Nhà Meo'
    },
    container: {
        url: 'https://truyennhameo.com/manga/du-dich-tham-nhap/',
        id: JSON.stringify({ post: '10506', slug: '/manga/du-dich-tham-nhap/' }),
        title: 'Dụ Địch Thâm Nhập'
    },
    child: {
        id: '/manga/du-dich-tham-nhap/chapter-4/',
        title: 'Chapter 4'
    },
    entry: {
        index: 0,
        size: 261_416,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();