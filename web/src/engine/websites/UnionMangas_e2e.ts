import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'unionmangas',
        title: 'UnionMangas',
        //timeout : 25000 //homepage load is damn slow in real browser
    },
    container: {
        url: 'https://guimah.com/perfil/V1lmMXhZa1NEdWJicUhxYUdRPT0=',
        id: '/perfil/V1lmMXhZa1NEdWJicUhxYUdRPT0=',
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