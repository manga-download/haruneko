import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tecnoscan',
        title: 'Tecno Scan'
    },
    container: {
        url: 'https://visortecno.com/manga/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios/',
        id: '/manga/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios/',
        title: 'Su Bao tiene tres años y medio, y está siendo mimada por sus ocho tíos'
    },
    child: {
        id: '/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios-capitulo-2/',
        title: 'Capítulo 2',
        timeout: 25000
    },
    entry: {
        index: 2,
        size: 763_436,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());