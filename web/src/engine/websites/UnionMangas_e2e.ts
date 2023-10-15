import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'unionmangas',
        title: 'UnionMangas',
    },
    container: {
        url: 'https://unionmangasbr.top/manga/one-piece',
        id: '/manga/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/leitor/THQzczVyWVZEcWpPdldQQlNBPT0=/1080',
        title: 'Cap. 1080'
    },
    entry: {
        index: 0,
        size: 426_983,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());