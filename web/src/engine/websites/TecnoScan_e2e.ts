import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tecnoscan',
        title: 'Tecno Scan'
    },
    container: {
        url: 'https://tecnoscann.com/manga/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios/',
        id: JSON.stringify({ post: '3679', slug: '/manga/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios/' }),
        title: 'Su Bao tiene tres años y medio, y está siendo mimada por sus ocho tíos'
    },
    child: {
        id: '/manga/su-bao-tiene-tres-anos-y-medio-y-esta-siendo-mimada-por-sus-ocho-tios/capitulo-2/',
        title: 'Capítulo 2'
    },
    entry: {
        index: 0,
        size: 1_504_038,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());