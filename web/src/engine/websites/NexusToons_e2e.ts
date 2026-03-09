import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nexustoons',
        title: 'Nexus Toons'
    },
    container: {
        url: 'https://nexustoons.com/manga/espadas-demoniacas-da-vinganca',
        id: 'espadas-demoniacas-da-vinganca',
        title: 'Espadas Demoníacas da Vingança'
    },
    child: {
        id: '241980',
        title: '18'
    },
    entry: {
        index: 1,
        size: 542_002,
        type: 'image/webp'
    }
}).AssertWebsite();