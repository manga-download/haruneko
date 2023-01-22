import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'leviatanscans-es',
        title: 'LeviatanScans (Spanish)'
    },
    container: {
        url: 'https://es.leviatanscans.com/manga/el-retorno-del-archimago-de-8va-clase/',
        id: JSON.stringify({ post: '14', slug: '/manga/el-retorno-del-archimago-de-8va-clase/' }),
        title: 'El Retorno del Archimago de 8va-clase'
    },
    child: {
        id: '/manga/el-retorno-del-archimago-de-8va-clase/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 562_756,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());