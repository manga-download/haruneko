import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'unionmangas',
        title: 'UnionMangas',
        //timeout : 25000 //homepage load is damn slow in real browser
    },
    container: {
        url: 'https://unionleitor.top/pagina-manga/one-piece',
        id: '/pagina-manga/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/leitor/One_Piece/1080',
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