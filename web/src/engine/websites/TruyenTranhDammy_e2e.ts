import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhdammy',
        title: 'TruyenTranhDammy'
    },
    container: {
        url: 'https://meomeoteam.org/manga/du-dich-tham-nhap/',
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

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());